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

const basicSearch = async (searchSring, type) => {
  if (type === "diets") {
    return await prisma.recipe.findMany({
      where: {
        name: {
          contains: searchString,
          mode: "insensitive",
        },
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
    });
  }
};

const filter = async (tags, type) => {
  if (type === "diets") {
    return await prisma.recipe.findMany({
      where: {
        NOT: {
          filters: {
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
