const prisma = require("../config/prisma");

const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
};

const parseMacro = (str) => parseInt(str?.replace(/\D/g, '')) || 0;

const hasAllergyConflict = (currentRecipes, userAllergies) => {
  if (!userAllergies || userAllergies.length === 0) return false;
  return currentRecipes.some(recipe =>
      recipe.allergies && recipe.allergies.some(allergy => userAllergies.includes(allergy))
  );
};

const needsMusclePrioritization = (currentExercises, userMuscleGroups) => {
  if (!userMuscleGroups || userMuscleGroups.length === 0) return false;

  const hasAnyMatch = currentExercises.some(ex =>
      ex.muscles && ex.muscles.some(m => userMuscleGroups.includes(m))
  );
  return !hasAnyMatch;
};

const generateDailyDiet = (target, favorites, allRecipes, userAllergies) => {
  if (!allRecipes || allRecipes.length === 0) return [];

  let safeRecipes = allRecipes;
  let safeFavorites = favorites;

  if (userAllergies && userAllergies.length > 0) {
    safeRecipes = allRecipes.filter(r => !r.allergies || !r.allergies.some(a => userAllergies.includes(a)));
    safeFavorites = favorites.filter(r => !r.allergies || !r.allergies.some(a => userAllergies.includes(a)));
  }

  if (safeRecipes.length === 0) safeRecipes = allRecipes;

  const getPool = (moment) => {
    const favs = safeFavorites.filter(r => r.moment === moment);
    return favs.length > 0 ? favs : safeRecipes.filter(r => r.moment === moment);
  };

  const poolDesayuno = getPool('DESAYUNO');
  const poolAlmuerzo = getPool('ALMUERZO');
  const poolCena = getPool('CENA');
  const poolCualquiera = safeFavorites.length >= 5 ? safeFavorites : safeRecipes;

  let bestCombo = [];
  let minDiff = Infinity;
  const targetSize = Math.min(5, safeRecipes.length);

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

  if (bestCombo.length === 0) bestCombo = safeRecipes.slice(0, 5);
  return bestCombo;
};

const generateDailySport = (targetLevel, favorites, allExercises, userMuscleGroups) => {
  if (!allExercises || allExercises.length === 0) return [];

  let poolGlobal = allExercises.filter(e => e.level === targetLevel);

  if (poolGlobal.length < 5) {
    if (targetLevel === 'AVANZADOS') {
      const intermedios = allExercises.filter(e => e.level === 'INTERMEDIO');
      poolGlobal = [...poolGlobal, ...intermedios];
    } else if (targetLevel === 'INTERMEDIO') {
      const principiantes = allExercises.filter(e => e.level === 'PRINCIPIANTE');
      poolGlobal = [...poolGlobal, ...principiantes];
    }
    if (poolGlobal.length < 5) poolGlobal = allExercises;
  }

  const pool = favorites.length >= 5 ? favorites : [...favorites, ...poolGlobal];

  let bestCombo = [];
  let bestScore = -1;
  const targetSize = Math.min(5, pool.length);

  for (let i = 0; i < 50; i++) {
    const combo = new Set();
    let attempts = 0;

    while (combo.size < targetSize && attempts < 50) {
      combo.add(pool[Math.floor(Math.random() * pool.length)]);
      attempts++;
    }

    const currentCombo = Array.from(combo).filter(Boolean);
    if (currentCombo.length < targetSize) continue;

    const uniqueMuscles = new Set();
    let matchCount = 0;

    currentCombo.forEach(ex => {
      if (ex.muscles && Array.isArray(ex.muscles)) {
        ex.muscles.forEach(m => uniqueMuscles.add(m));

        // Contamos cuántos ejercicios de este combo tocan los músculos favoritos del usuario
        if (userMuscleGroups && userMuscleGroups.length > 0) {
          if (ex.muscles.some(m => userMuscleGroups.includes(m))) {
            matchCount++;
          }
        }
      }
    });

    const score = (matchCount * 10) + uniqueMuscles.size;

    if (score > bestScore) {
      bestScore = score;
      bestCombo = currentCombo;
    }
  }

  if (bestCombo.length === 0) bestCombo = poolGlobal.slice(0, 5);
  return bestCombo;
};

class DashboardService {

  static async getDietaDashboard(userId) {
    const dashboardDiet = await prisma.dashboardDiet.findUnique({
      where: { userId: parseInt(userId) },
      include: { User: true, recetas: true, DailyRecipes: { include: { Recipe: true } } }
    });

    if (!dashboardDiet) throw new Error("Dashboard de dieta no encontrado");

    let dailyPlan = dashboardDiet.DailyRecipes;
    const userAllergies = dashboardDiet.User?.allergies || [];

    if (!dailyPlan || !isToday(dailyPlan.date) || hasAllergyConflict(dailyPlan.Recipe, userAllergies)) {
      const allRecipes = await prisma.recipe.findMany();
      const newPlan = generateDailyDiet(dashboardDiet, dashboardDiet.recetas, allRecipes, userAllergies);

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
        protein: dashboardDiet.protein,
        fats: dashboardDiet.fats,
        carbs: dashboardDiet.carbs,
        water: dashboardDiet.water,
        recetas: dailyPlan.Recipe
      }
    };
  }

  static async getDeporteDashboard(userId) {
    const dashboardSport = await prisma.dashboardSport.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        User: { include: { biometrics: true } },
        Exercise: true,
        DailyExercises: { include: { Exercise: true } }
      }
    });

    if (!dashboardSport) throw new Error("Dashboard de deporte no encontrado");

    let dailyPlan = dashboardSport.DailyExercises;
    const userMuscleGroups = dashboardSport.User?.muscleGroups || [];

    if (!dailyPlan || !isToday(dailyPlan.date) || needsMusclePrioritization(dailyPlan.Exercise, userMuscleGroups)) {
      const allExercises = await prisma.exercise.findMany();

      const activity = dashboardSport.User?.biometrics?.activity?.toLowerCase() || '';
      const goal = dashboardSport.User?.biometrics?.goal?.toLowerCase() || '';

      let targetLevel = 'PRINCIPIANTE';

      if (activity.includes('moderado') || activity.includes('ligero')) targetLevel = 'INTERMEDIO';
      if (activity.includes('activo') || activity.includes('fuerte') || activity.includes('diari')) targetLevel = 'AVANZADOS';

      if (goal.includes('volumen') || goal.includes('musculo') || goal.includes('peso') || goal.includes('fuerza') || goal.includes('subir')) {
        if (targetLevel === 'PRINCIPIANTE') targetLevel = 'INTERMEDIO';
        else if (targetLevel === 'INTERMEDIO') targetLevel = 'AVANZADOS';
      }

      const newPlan = generateDailySport(targetLevel, dashboardSport.Exercise, allExercises, userMuscleGroups);

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