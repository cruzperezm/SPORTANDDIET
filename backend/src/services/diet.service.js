const prisma = require("../config/prisma");

const getAllDiets = async () => {
  return await prisma.diet.findMany();
};

const getDietById = async (dietId) => {
  return await prisma.diet.findUnique({
    where: {
      id: dietId,
    },
  });
};

const getRecipeById = async (recipeId) => {
  return await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });
};

const getRecipesByMoment = async (dietId, moment) => {
  return await prisma.recipe.findMany({
    where: {
      dietId: dietId,
      moment: moment,
    },
  });
};

module.exports = {
  getAllDiets,
  getDietById,
  getRecipeById,
  getRecipesByMoment,
};
