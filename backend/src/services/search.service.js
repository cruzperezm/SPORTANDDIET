const prisma = require("../config/prisma");

const getSuggestions = async (searchString, type) => {
  if (type === "diets") {
    return await prisma.recipe.findMany({
      where: {
        name: {
          contains: searchString,
          mode: "insensitive",
        },
      },
      take: 5,
      select: {
        id: true,
        name: true,
      },
    });
  } else if (type === "exercises") {
    return await prisma.exercise.findMany({
      where: {
        name: {
          contains: searchString,
          mode: "insensitive",
        },
      },
      take: 5,
      select: {
        id: true,
        name: true,
      },
    });
  }
};

const basicSearch = async (searchString, type) => {
  if (type === "diets") {
    return await prisma.recipe.findMany({
      where: {
        name: {
          contains: searchString,
          mode: "insensitive",
        },
      },
      include: {
        diet: {
          select: { title: true },
        },
      },
    });
  } else if (type === "exercises") {
    return await prisma.exercise.findMany({
      relationLoadStrategy: "join",
      where: {
        name: {
          contains: searchString,
          mode: "insensitive",
        },
      },
    });
  }
};

const filter = async (id, tags, type, classification) => {
  if (type === "diets") {
    return await prisma.recipe.findMany({
      where: {
        dietId: id,
        moment: classification,
        NOT: {
          allergies: {
            hasSome: tags,
          },
        },
      },
    });
  } else if (type === "exercises") {
    return await prisma.exercise.findMany({
      where: {
        filters: {
          hasSome: tags,
        },
      },
    });
  }
};

module.exports = { getSuggestions, basicSearch, filter };
