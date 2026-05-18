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

// ALGORITMO: Elige 5 recetas ajustadas a los macros
const generateDailyDiet = (target, favorites, allRecipes) => {
  // Aseguramos tener de dónde sacar cada momento. Si no hay en favoritos, usamos el global.
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

  // Generamos 50 combinaciones al azar y evaluamos cuál se acerca más a los requerimientos
  for (let i = 0; i < 50; i++) {
    const combo = new Set();

    // Obligatorio: 1 de cada
    if(poolDesayuno.length) combo.add(poolDesayuno[Math.floor(Math.random() * poolDesayuno.length)]);
    if(poolAlmuerzo.length) combo.add(poolAlmuerzo[Math.floor(Math.random() * poolAlmuerzo.length)]);
    if(poolCena.length) combo.add(poolCena[Math.floor(Math.random() * poolCena.length)]);

    // 2 Extras
    let attempts = 0;
    while (combo.size < 5 && attempts < 20) {
      combo.add(poolCualquiera[Math.floor(Math.random() * poolCualquiera.length)]);
      attempts++;
    }

    const currentCombo = Array.from(combo).filter(Boolean);
    if (currentCombo.length < 5) continue;

    // Calcular desviación de macros
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

// ALGORITMO: Elige 5 ejercicios aleatorios de favoritos o globales
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
    const dashboard = await prisma.dashboard.findFirst({
      where: { userId: parseInt(userId) },
      include: {
        user: true,
        dieta: {
          include: {
            recetas: true, // Catálogo de "Me Gusta"
            DailyRecipes: { include: { Recipe: true } } // Plan actual
          }
        }
      }
    });

    if (!dashboard || !dashboard.dieta) throw new Error("Dashboard de dieta no encontrado");

    let dailyPlan = dashboard.dieta.DailyRecipes;

    // LÓGICA DE DÍA: ¿Es día nuevo o no hay plan?
    if (!dailyPlan || !isToday(dailyPlan.date)) {
      const allRecipes = await prisma.recipe.findMany();
      const newPlan = generateDailyDiet(dashboard.dieta, dashboard.dieta.recetas, allRecipes);

      // Usamos SET para sobreescribir el array de recetas de ayer por las de hoy
      dailyPlan = await prisma.dailyRecipes.upsert({
        where: { dashboardDietId: dashboard.dieta.id },
        update: {
          date: new Date(),
          Recipe: { set: newPlan.map(r => ({ id: r.id })) }
        },
        create: {
          dashboardDietId: dashboard.dieta.id,
          date: new Date(),
          Recipe: { connect: newPlan.map(r => ({ id: r.id })) }
        },
        include: { Recipe: true }
      });
    }

    // Empaquetado manteniendo estructura del frontend
    return {
      usuario: { id: userId, nombre: dashboard.user.username },
      dieta: {
        calorias_objetivo: dashboard.dieta.calories_goal,
        calorias_totales: dashboard.dieta.calories_total,
        macros1: [
          { nombre: 'Proteínas', valor: 0, progreso: 0, objetivo: dashboard.dieta.protein },
          { nombre: 'Grasas', valor: 0, progreso: 0, objetivo: dashboard.dieta.fats },
          { nombre: 'Carbohidratos', valor: 0, progreso: 0, objetivo: dashboard.dieta.carbs }
        ],
        macros2: [],
        recetas: dailyPlan.Recipe // Devuelve el plan de HOY
      }
    };
  }

  static async getDeporteDashboard(userId) {
    const dashboard = await prisma.dashboard.findFirst({
      where: { userId: parseInt(userId) },
      include: {
        user: true,
        deporte: {
          include: {
            Exercise: true, // "Me Gusta"
            DailyExercises: { include: { Exercise: true } } // Plan actual
          }
        }
      }
    });

    if (!dashboard || !dashboard.deporte) throw new Error("Dashboard de deporte no encontrado");

    let dailyPlan = dashboard.deporte.DailyExercises;

    // LÓGICA DE DÍA
    if (!dailyPlan || !isToday(dailyPlan.date)) {
      const allExercises = await prisma.exercise.findMany();
      const newPlan = generateDailySport(dashboard.deporte.Exercise, allExercises);

      dailyPlan = await prisma.dailyExercises.upsert({
        where: { dashboardSportId: dashboard.deporte.id },
        update: {
          date: new Date(),
          Exercise: { set: newPlan.map(e => ({ id: e.id })) }
        },
        create: {
          dashboardSportId: dashboard.deporte.id,
          date: new Date(),
          Exercise: { connect: newPlan.map(e => ({ id: e.id })) }
        },
        include: { Exercise: true }
      });
    }

    return {
      usuario: { id: userId, nombre: dashboard.user.username },
      actividades: [
        { nombre: 'Moverse', valor: `${dashboard.deporte.calories || 0} kcal` },
        { nombre: 'Ejercicio', valor: `${dashboard.deporte.time || 0} min` },
        { nombre: 'De Pie', valor: `0 hr` }
      ],
      deporte: {
        semana: dashboard.deporte.week || [],
        ejercicios: dailyPlan.Exercise // Devuelve el plan de HOY
      }
    };
  }

  // --- GESTIÓN DE FAVORITOS (Añadir al catálogo del usuario) ---
  static async addFavoriteRecipe(userId, recipeId) {
    const d = await prisma.dashboard.findFirst({ where: { userId: parseInt(userId) } });
    return await prisma.dashboardDiet.update({
      where: { id: d.dashboardDietId },
      data: { recetas: { connect: { id: parseInt(recipeId) } } } // Añade al array global
    });
  }

  static async addFavoriteExercise(userId, exerciseId) {
    const d = await prisma.dashboard.findFirst({ where: { userId: parseInt(userId) } });
    return await prisma.dashboardSport.update({
      where: { id: d.dashboardSportId },
      data: { Exercise: { connect: { id: parseInt(exerciseId) } } } // Añade al array global
    });
  }
}

module.exports = DashboardService;