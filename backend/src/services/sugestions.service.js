const prisma = require("../config/prisma");

// Sugerencia de Recetas (HU-9)
const getRecipeSuggestions = async (userId) => {
    const bio = await prisma.biometrics.findFirst({ where: { ownerId: userId } });

    if (!bio || !bio.kcalObjetivo) {
        return [];
    }

    // El criterio: Recetas que encajen en una comida (~30% de kcal diarias)
    const kcalMax = bio.kcalObjetivo * 0.35;

    return await prisma.recipe.findMany({
        where: {
            calories: { lte: kcalMax },
            // Filtrar alérgenos si el usuario tiene
        },
        take: 3
    });
};

// Sugerencia de Ejercicios (HU-12)
const getExerciseSuggestions = async (userId) => {
    const bio = await prisma.biometrics.findFirst({ where: { ownerId: userId } });

    if (!bio || !bio.activity) {
        return [];
    }

    // Criterio: Si actividad es baja, sugerir ejercicios de menor intensidad
    let intensity = bio.activity === 'sedentario' ? 'baja' : 'moderada';

    return await prisma.exercise.findMany({
        where: { difficulty: intensity },
        take: 3
    });
};

module.exports = { getRecipeSuggestions, getExerciseSuggestions };