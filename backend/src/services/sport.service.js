const prisma = require("../config/prisma");

const getAllPlans = async () => {
  return await prisma.exercisePlan.findMany({
    select: {
      id: true,
      title: true,
      subtitle: true,
      image: true,
    },
  });
};

const getPlanById = async (planId) => {
  return await prisma.exercisePlan.findUnique({
    where: {
      id: planId,
    },
  });
};

const getExerciseById = async (exerciseId) => {
  return await prisma.exercise.findUnique({
    where: {
      id: exerciseId,
    },
  });
};

const getExercisesByLevel = async (planId, level) => {
  return await prisma.exercise.findMany({
    where: {
      exercisePlanId: planId,
      level: level,
    },
  });
};

module.exports = {
  getAllPlans,
  getExercisesByLevel,
  getExerciseById,
  getPlanById,
};
