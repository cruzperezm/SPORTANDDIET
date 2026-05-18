const prisma = require("../config/prisma");

// --- FUNCIONES AUXILIARES ---
const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
};

const parseMacro = (str) => parseInt(str?.replace(/\D/g, '')) || 0;

const generateDailyDiet = (target, favorites, allRecipes) => {
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

  for (let i = 0; i < 50; i++) {
    const combo = new Set();

    if(poolDesayuno.length) combo.add(poolDesayuno[Math.floor(Math.random() * poolDesayuno.length)]);
    if(poolAlmuerzo.length) combo.add(poolAlmuerzo[Math.floor(Math.random() * poolAlmuerzo.length)]);
    if(poolCena.length) combo.add(poolCena[Math.floor(Math.random() * poolCena.length)]);

    let attempts = 0;
    while (combo.size < 5 && attempts < 20) {
      combo.add(poolCualquiera[Math.floor(Math.random() * poolCualquiera.length)]);
      attempts++;
    }

    const currentCombo = Array.from(combo).filter(Boolean);
    if (currentCombo.length < 5) continue;

    let kcal = 0, p = 0, f = 0, c = 0;
    currentCombo.forEach(r => {
      kcal += r.calories;
      p += parseMacro(r.macros[0]);
      f += parseMacro(r.macros[1]);
      c += parseMacro(r.macros[2]);
    });

    const diff = Math.abs(kcal - target.calories_goal) +
        Math.abs(p - target.protein) * 4 +
        Math.abs(f - target.fats) * 9 +
        Math.abs(c - target.carbs) * 4;

    if (diff < minDiff) {
      minDiff = diff;
      bestCombo = currentCombo;
    }
  }
  return bestCombo;
};

const generateDailySport = (favorites, allExercises) => {
  const pool = favorites.length >= 5 ? favorites : allExercises;
  const combo = new Set();
  let attempts = 0;

  while (combo.size < 5 && attempts < 50 && pool.length > 0) {
    combo.add(pool[Math.floor(Math.random() * pool.length)]);
    attempts++;
  }
  return Array.from(combo).filter(Boolean);
};

class DashboardService {

  static async getDietaDashboard(userId) {
    // Buscamos directamente en DashboardDiet
    const dashboardDiet = await prisma.dashboardDiet.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        User: true,
        recetas: true, // Catálogo de "Me Gusta"
        DailyRecipes: { include: { Recipe: true } } // Plan actual
      }
    });

    if (!dashboardDiet) throw new Error("Dashboard de dieta no encontrado");

    let dailyPlan = dashboardDiet.DailyRecipes;

    if (!dailyPlan || !isToday(dailyPlan.date)) {
      const allRecipes = await prisma.recipe.findMany();
      const newPlan = generateDailyDiet(dashboardDiet, dashboardDiet.recetas, allRecipes);

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
    }

    return {
      usuario: { id: userId, nombre: dashboardDiet.User?.username || "Usuario" },
      dieta: {
        calorias_objetivo: dashboardDiet.calories_goal,
        calorias_totales: dashboardDiet.calories_total,
        macros1: [
          { nombre: 'Proteínas', valor: 0, progreso: 0, objetivo: dashboardDiet.protein },
          { nombre: 'Grasas', valor: 0, progreso: 0, objetivo: dashboardDiet.fats },
          { nombre: 'Carbohidratos', valor: 0, progreso: 0, objetivo: dashboardDiet.carbs }
        ],
        macros2: [],
        recetas: dailyPlan.Recipe
      }
    };
  }

  static async getDeporteDashboard(userId) {
    // Buscamos directamente en DashboardSport
    const dashboardSport = await prisma.dashboardSport.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        User: true,
        Exercise: true, // "Me Gusta"
        DailyExercises: { include: { Exercise: true } } // Plan actual
      }
    });

    if (!dashboardSport) throw new Error("Dashboard de deporte no encontrado");

    let dailyPlan = dashboardSport.DailyExercises;

    if (!dailyPlan || !isToday(dailyPlan.date)) {
      const allExercises = await prisma.exercise.findMany();
      const newPlan = generateDailySport(dashboardSport.Exercise, allExercises);

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