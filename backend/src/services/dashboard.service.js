const prisma = require("../config/prisma");

const isToday = (date) => {
  if (!date) return false;
  const today = new Date(Date.now());
  return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  );
};

const parseMacro = (str) => parseInt(str?.replace(/\D/g, "")) || 0;

const hasAllergyConflict = (currentRecipes, userAllergies) => {
  if (!userAllergies || userAllergies.length === 0) return false;
  return currentRecipes.some(
      (recipe) =>
          recipe.allergies &&
          recipe.allergies.some((allergy) => userAllergies.includes(allergy)),
  );
};

const needsMusclePrioritization = (currentExercises, userMuscleGroups) => {
  if (!userMuscleGroups || userMuscleGroups.length === 0) return false;

  const hasAnyMatch = currentExercises.some(
      (ex) => ex.muscles && ex.muscles.some((m) => userMuscleGroups.includes(m)),
  );
  return !hasAnyMatch;
};

const generateDailyDiet = (target, favorites, allRecipes, userAllergies) => {
  if (!allRecipes || allRecipes.length === 0) return [];

  let safeRecipes = allRecipes;
  let safeFavorites = favorites;

  if (userAllergies && userAllergies.length > 0) {
    safeRecipes = allRecipes.filter(
        (r) =>
            !r.allergies || !r.allergies.some((a) => userAllergies.includes(a)),
    );
    safeFavorites = favorites.filter(
        (r) =>
            !r.allergies || !r.allergies.some((a) => userAllergies.includes(a)),
    );
  }

  if (safeRecipes.length === 0) safeRecipes = allRecipes;

  const getPool = (moment) => {
    const favs = safeFavorites.filter((r) => r.moment === moment);
    return favs.length > 0
        ? favs
        : safeRecipes.filter((r) => r.moment === moment);
  };

  const poolDesayuno = getPool("DESAYUNO");
  const poolAlmuerzo = getPool("ALMUERZO");
  const poolCena = getPool("CENA");
  const poolCualquiera =
      safeFavorites.length >= 5 ? safeFavorites : safeRecipes;

  let bestCombo = [];
  let minDiff = Infinity;
  const targetSize = Math.min(5, safeRecipes.length);

  for (let i = 0; i < 50; i++) {
    const combo = new Set();
    if (poolDesayuno.length)
      combo.add(poolDesayuno[Math.floor(Math.random() * poolDesayuno.length)]);
    if (poolAlmuerzo.length)
      combo.add(poolAlmuerzo[Math.floor(Math.random() * poolAlmuerzo.length)]);
    if (poolCena.length)
      combo.add(poolCena[Math.floor(Math.random() * poolCena.length)]);

    let attempts = 0;
    while (combo.size < targetSize && attempts < 30) {
      combo.add(
          poolCualquiera[Math.floor(Math.random() * poolCualquiera.length)],
      );
      attempts++;
    }

    const currentCombo = Array.from(combo).filter(Boolean);
    if (currentCombo.length < targetSize) continue;

    let kcal = 0,
        p = 0,
        f = 0,
        c = 0;
    currentCombo.forEach((r) => {
      kcal += r.calories;
      p += parseMacro(r.macros[0]);
      f += parseMacro(r.macros[1]);
      c += parseMacro(r.macros[2]);
    });

    const diff =
        Math.abs(kcal - target.calories_goal) +
        Math.abs(p - target.protein) * 4 +
        Math.abs(f - target.fats) * 9 +
        Math.abs(c - target.carbs) * 4;

    if (diff < minDiff) {
      minDiff = diff;
      bestCombo = currentCombo;
    }
  }

  if (bestCombo.length === 0) bestCombo = safeRecipes.slice(0, 5);
  return bestCombo;
};

// FUNCIÓN CORREGIDA: Ahora tiene la segunda mitad intacta
const generateDailySport = (targetLevel, favorites, allExercises, userMuscleGroups) => {
  if (!allExercises || allExercises.length === 0) return [];

  let poolGlobal = allExercises.filter((e) => e.level?.toUpperCase() === targetLevel);

  if (poolGlobal.length < 5) {
    if (targetLevel === "AVANZADOS") {
      const intermedios = allExercises.filter((e) => e.level?.toUpperCase() === "INTERMEDIO");
      poolGlobal = [...poolGlobal, ...intermedios];
    } else if (targetLevel === "INTERMEDIO") {
      const principiantes = allExercises.filter((e) => e.level?.toUpperCase() === "PRINCIPIANTE");
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

    currentCombo.forEach((ex) => {
      if (ex.muscles && Array.isArray(ex.muscles)) {
        ex.muscles.forEach((m) => uniqueMuscles.add(m));

        if (userMuscleGroups && userMuscleGroups.length > 0) {
          if (ex.muscles.some((m) => userMuscleGroups.includes(m))) {
            matchCount++;
          }
        }
      }
    });

    const score = matchCount * 10 + uniqueMuscles.size;

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
    try {
      const dashboardDiet = await prisma.dashboardDiet.findFirst({
        where: { userId: userId },
        select: {
          id: true,
          calories_total: true,
          calories_goal: true,
          protein: true,
          fats: true,
          carbs: true,
          water: true,
          updatedAt: true,
          recipes: {
            select: { name: true, image: true, calories: true },
          },
          dailyRecipes: {
            include: { recipes: true },
          },
        },
      });

      if (!dashboardDiet) throw new Error("Dashboard de dieta no encontrado");

      return {
        ...dashboardDiet,
        dailyPlan: dashboardDiet.dailyRecipes || { recipes: [] }
      };
    } catch (error) {
      throw new Error(`Error fetching diet dashboard: ${error.message}`);
    }
  }

  static async getDeporteDashboard(userId) {
    try {
      let dashboardSport = await prisma.dashboardSport.findFirst({
        where: { userId: userId },
        select: {
          id: true,
          userId: true,
          week: true,
          updatedAt: true,
          calories: true,
          time: true,
          dailyExercises: {
            include: { exercises: true },
          },
          exercises: {
            select: { name: true, image: true, duration: true },
          },
          user: {
            select: { biometrics: true, muscleGroups: true },
          },
        },
      });

      if (!dashboardSport) throw new Error("Dashboard de deporte no encontrado");

      let week = [
        { dia: "L", valor: 0 }, { dia: "M", valor: 0 }, { dia: "X", valor: 0 },
        { dia: "J", valor: 0 }, { dia: "V", valor: 0 }, { dia: "S", valor: 0 },
        { dia: "D", valor: 0 },
      ];

      if (!dashboardSport.week || dashboardSport.week.length === 0) {
        dashboardSport.week = week;
      } else {
        for (let i = 0; i < 7; i++) {
          week[i].valor = dashboardSport.week[i] || 0;
        }
        dashboardSport.week = week;
      }

      return {
        ...dashboardSport,
        dailyPlan: dashboardSport.dailyExercises || { exercises: [] }
      };
    } catch (error) {
      throw new Error(`Error fetching sport dashboard: ${error.message}`);
    }
  }

  static async addFavoriteRecipe(userId, recipeId) {
    const diet = await prisma.dashboardDiet.findUnique({
      where: { userId: parseInt(userId) },
    });
    if (!diet) throw new Error("Dashboard de dieta no encontrado");
    return await prisma.dashboardDiet.update({
      where: { id: diet.id },
      data: { recipes: { connect: { id: parseInt(recipeId) } } },
    });
  }

  static async addFavoriteExercise(userId, exerciseId) {
    const sport = await prisma.dashboardSport.findUnique({
      where: { userId: parseInt(userId) },
    });
    if (!sport) throw new Error("Dashboard de deporte no encontrado");
    return await prisma.dashboardSport.update({
      where: { id: sport.id },
      data: { exercises: { connect: { id: parseInt(exerciseId) } } },
    });
  }

  static async initializeDailyPlans(userId) {
    try {
      console.log(`Inicializando planes para el usuario ${userId}...`);

      // 1. INICIALIZAR DIETA
      const dashboardDiet = await prisma.dashboardDiet.findFirst({
        where: { userId: userId },
        include: { dailyRecipes: { include: { recipes: true } }, recipes: true }
      });

      if (dashboardDiet && (!dashboardDiet.dailyRecipes || !isToday(dashboardDiet.dailyRecipes?.date))) {
        const allRecipes = await prisma.recipe.findMany();
        const favorites = dashboardDiet.recipes || [];
        const newDietPlan = generateDailyDiet(dashboardDiet, favorites, allRecipes);

        await prisma.dailyRecipes.upsert({
          where: { dashboardDietId: dashboardDiet.id },
          update: {
            date: new Date(),
            recipes: { set: newDietPlan.map((r) => ({ id: r.id })) },
          },
          create: {
            dashboardDietId: dashboardDiet.id,
            date: new Date(),
            recipes: { connect: newDietPlan.map((r) => ({ id: r.id })) },
          }
        });
      }

      // 2. INICIALIZAR DEPORTE
      const dashboardSport = await prisma.dashboardSport.findFirst({
        where: { userId: userId },
        include: {
          dailyExercises: { include: { exercises: true } },
          exercises: true,
          user: { include: { biometrics: true } }
        }
      });

      const userMuscleGroups = dashboardSport?.user?.muscleGroups || [];
      const currentExercises = dashboardSport?.dailyExercises?.exercises || [];

      if (
          dashboardSport &&
          (!dashboardSport.dailyExercises ||
              !isToday(dashboardSport.dailyExercises?.date) ||
              needsMusclePrioritization(currentExercises, userMuscleGroups))
      ) {
        const allExercises = await prisma.exercise.findMany();
        const activity = dashboardSport.user?.biometrics?.activity?.toLowerCase() || "";
        const goal = dashboardSport.user?.biometrics?.goal?.toLowerCase() || "";

        let targetLevel = "PRINCIPIANTE";
        if (activity.includes("moderado") || activity.includes("ligero")) targetLevel = "INTERMEDIO";
        if (activity.includes("activo") || activity.includes("fuerte") || activity.includes("diari")) targetLevel = "AVANZADOS";
        if (goal.includes("volumen") || goal.includes("musculo") || goal.includes("peso") || goal.includes("fuerza") || goal.includes("subir")) {
          if (targetLevel === "PRINCIPIANTE") targetLevel = "INTERMEDIO";
          else if (targetLevel === "INTERMEDIO") targetLevel = "AVANZADOS";
        }

        const favorites = dashboardSport.exercises || [];
        const newSportPlan = generateDailySport(targetLevel, favorites, allExercises, userMuscleGroups);

        await prisma.dailyExercises.upsert({
          where: { dashboardSportId: dashboardSport.id },
          update: {
            date: new Date(),
            exercises: { set: newSportPlan.map((e) => ({ id: e.id })) },
          },
          create: {
            dashboardSportId: dashboardSport.id,
            date: new Date(),
            exercises: { connect: newSportPlan.map((e) => ({ id: e.id })) },
          }
        });
      }

      return { message: "Planes inicializados correctamente en BBDD." };
    } catch (error) {
      console.error("Error inicializando planes:", error);
    }
  }
}

module.exports = DashboardService;