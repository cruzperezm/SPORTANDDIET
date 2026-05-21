const prisma = require("../config/prisma");

const getRecipesByMoment = async (userId) => {
  let response = await prisma.dashboardDiet.findUnique({
    where: {
      userId: userId,
    },
    include: {
      recipes: {
        select: { id: true, name: true, image: true, moment: true },
      },
    },
  });

  let recipesByMoment = {
    Desayuno: [],
    Almuerzo: [],
    Cena: [],
  };

  console.log("Recipes", response);

  if (response.recipes) {
    for (let elem of response.recipes) {
      if (elem.moment === "DESAYUNO") {
        recipesByMoment["Desayuno"].push(elem);
      } else if (elem.moment === "ALMUERZO") {
        recipesByMoment["Almuerzo"].push(elem);
      } else {
        recipesByMoment["Cena"].push(elem);
      }
    }
  }

  return recipesByMoment;
};

const getExercisesByLevel = async (userId) => {
  let response = await prisma.dashboardSport.findUnique({
    where: {
      userId: userId,
    },
    include: {
      exercises: {
        select: { id: true, name: true, image: true, level: true },
      },
    },
  });

  let exercisesByLevel = {
    Principiante: [],
    Intermedio: [],
    Avanzados: [],
  };

  if (response.exercises) {
    for (let elem of response.exercises) {
      if (elem.level === "PRINCIPIANTE") {
        exercisesByLevel["Principiante"].push(elem);
      } else if (elem.level === "INTERMEDIO") {
        exercisesByLevel["Intermedio"].push(elem);
      } else {
        exercisesByLevel["Avanzados"].push(elem);
      }
    }
  }

  return exercisesByLevel;
};

module.exports = { getExercisesByLevel, getRecipesByMoment };
