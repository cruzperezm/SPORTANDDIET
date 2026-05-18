const prisma = require("../config/prisma");

const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
};

const parseMacro = (str) => parseInt(str?.replace(/\D/g, '')) || 0;

const generateDailyDiet = (target, favorites, allRecipes) => {
  if (!allRecipes || allRecipes.length === 0) return [];

  const getPool = (moment) => {
    const favs = favorites.filter(r => r.moment === moment);
    return favs.length > 0 ? favs : allRecipes.filter(r => r.moment === moment);
  };

  const poolDesayuno = getPool('DESAYUNO');
  const poolAlmuerzo = getPool('ALMUERZO');
  const poolCena = getPool('CENA');
  const poolCualquiera = favorites.length >= 5 ? favorites : allRecipes;

  let bestCombo = [];
  let minDiff = Infinity;
  const targetSize = Math.min(5, allRecipes.length);

  for (let i = 0; i < 50; i++) {
    const combo = new Set();
    if(poolDesayuno.length) combo.add(poolDesayuno[Math.floor(Math.random() * poolDesayuno.length)]);
    if(poolAlmuerzo.length) combo.add(poolAlmuerzo[Math.floor(Math.random() * poolAlmuerzo.length)]);
    if(poolCena.length) combo.add(poolCena[Math.floor(Math.random() * poolCena.length)]);

    let attempts = 0;
    while (combo.size < targetSize && attempts < 30) {
      combo.add(poolCualquiera[Math.floor(Math.random() * poolCualquiera.length)]);
      attempts++;
    }

    const currentCombo = Array.from(combo).filter(Boolean);
    if (currentCombo.length < targetSize) continue;

    let kcal = 0, p = 0, f = 0, c = 0;
    currentCombo.forEach(r => {
      kcal += r.calories;
      p += parseMacro(r.macros[0]);
      f += parseMacro(r.macros[1]);
      c += parseMacro(r.macros[2]);
    });

    const diff = Math.abs(kcal - target.calories_goal) + Math.abs(p - target.protein)*4 + Math.abs(f - target.fats)*9 + Math.abs(c - target.carbs)*4;

    if (diff < minDiff) {
      minDiff = diff;
      bestCombo = currentCombo;
    }
  }

  if (bestCombo.length === 0) bestCombo = allRecipes.slice(0, 5);
  return bestCombo;
};

const generateDailySport = (favorites, allExercises) => {
  if (!allExercises || allExercises.length === 0) return [];
  const pool = favorites.length >= 5 ? favorites : allExercises;
  const combo = new Set();
  let attempts = 0;
  const targetSize = Math.min(5, pool.length);

  while (combo.size < targetSize && attempts < 50) {
    combo.add(pool[Math.floor(Math.random() * pool.length)]);
    attempts++;
  }

  let finalPlan = Array.from(combo).filter(Boolean);
  if (finalPlan.length === 0) finalPlan = allExercises.slice(0, 5);
  return finalPlan;
};

class DashboardService {

  static async getDietaDashboard(userId) {
    console.log(`\n=== INICIANDO DASHBOARD DIETA PARA USUARIO: ${userId} ===`);

    const dashboardDiet = await prisma.dashboardDiet.findUnique({
      where: { userId: parseInt(userId) },
      include: { User: true, recetas: true, DailyRecipes: { include: { Recipe: true } } }
    });

    if (!dashboardDiet) throw new Error("Dashboard de dieta no encontrado");

    let dailyPlan = dashboardDiet.DailyRecipes;

    if (!dailyPlan || !isToday(dailyPlan.date)) {
      console.log("-> Generando nuevo plan de dieta...");

      const allRecipes = await prisma.recipe.findMany();
      console.log(`-> Recetas encontradas en la BBDD global: ${allRecipes.length}`);

      if (allRecipes.length === 0) {
        console.log("¡ALERTA ROJA! La base de datos devolvió 0 recetas. Revisa tu archivo .env");
      }

      const newPlan = generateDailyDiet(dashboardDiet, dashboardDiet.recetas, allRecipes);
      console.log(`-> El algoritmo seleccionó ${newPlan.length} recetas:`, newPlan.map(r => r.name));

      dailyPlan = await prisma.dailyRecipes.upsert({
        where: { dashboardDietId: dashboardDiet.id },
        update: {
          date: new Date(),
          Recipe: { set: newPlan.map(r => ({ id: r.id })) }
        },
        create: {
          dashboardDietId: dashboardDiet.id,
          date: new Date(),
          Recipe: { connect: newPlan.map(r => ({ id: r.id })) }
        },
        include: { Recipe: true }
      });

      console.log(`-> Guardado en BBDD exitoso. Recetas enlazadas: ${dailyPlan.Recipe.length}`);
    } else {
      console.log("-> El plan de hoy ya existía, cargando desde BBDD.");
    }

    // Devolvemos el objeto limpio, sin macros1 ni macros2
    return {
      usuario: { id: userId, nombre: dashboardDiet.User?.username || "Usuario" },
      dieta: {
        calorias_objetivo: dashboardDiet.calories_goal,
        calorias_totales: dashboardDiet.calories_total,
        protein: dashboardDiet.protein,
        fats: dashboardDiet.fats,
        carbs: dashboardDiet.carbs,
        water: dashboardDiet.water,
        recetas: dailyPlan.Recipe // Estas son las 5 recetas calculadas de hoy
      }
    };
  }

  static async getDeporteDashboard(userId) {
    console.log(`\n=== INICIANDO DASHBOARD DEPORTE PARA USUARIO: ${userId} ===`);

    const dashboardSport = await prisma.dashboardSport.findUnique({
      where: { userId: parseInt(userId) },
      include: { User: true, Exercise: true, DailyExercises: { include: { Exercise: true } } }
    });

    if (!dashboardSport) throw new Error("Dashboard de deporte no encontrado");

    let dailyPlan = dashboardSport.DailyExercises;

    if (!dailyPlan || !isToday(dailyPlan.date)) {
      const allExercises = await prisma.exercise.findMany();
      console.log(`-> Ejercicios encontrados en la BBDD global: ${allExercises.length}`);

      const newPlan = generateDailySport(dashboardSport.Exercise, allExercises);
      console.log(`-> El algoritmo seleccionó ${newPlan.length} ejercicios.`);

      dailyPlan = await prisma.dailyExercises.upsert({
        where: { dashboardSportId: dashboardSport.id },
        update: {
          date: new Date(),
          Exercise: { set: newPlan.map(e => ({ id: e.id })) }
        },
        create: {
          dashboardSportId: dashboardSport.id,
          date: new Date(),
          Exercise: { connect: newPlan.map(e => ({ id: e.id })) }
        },
        include: { Exercise: true }
      });
    }

    return {
      usuario: { id: userId, nombre: dashboardSport.User?.username || "Usuario" },
      actividades: [
        { nombre: 'Moverse', valor: `${dashboardSport.calories || 0} kcal` },
        { nombre: 'Ejercicio', valor: `${dashboardSport.time || 0} min` },
        { nombre: 'De Pie', valor: `0 hr` }
      ],
      deporte: {
        semana: dashboardSport.week || [],
        ejercicios: dailyPlan.Exercise
      }
    };
  }

  static async addFavoriteRecipe(userId, recipeId) {
    const diet = await prisma.dashboardDiet.findUnique({ where: { userId: parseInt(userId) } });
    if(!diet) throw new Error("Dashboard de dieta no encontrado");
    return await prisma.dashboardDiet.update({
      where: { id: diet.id },
      data: { recetas: { connect: { id: parseInt(recipeId) } } }
    });
  }

  static async addFavoriteExercise(userId, exerciseId) {
    const sport = await prisma.dashboardSport.findUnique({ where: { userId: parseInt(userId) } });
    if(!sport) throw new Error("Dashboard de deporte no encontrado");
    return await prisma.dashboardSport.update({
      where: { id: sport.id },
      data: { Exercise: { connect: { id: parseInt(exerciseId) } } }
    });
  }
}

module.exports = DashboardService;