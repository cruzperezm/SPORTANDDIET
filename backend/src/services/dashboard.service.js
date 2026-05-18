const prisma = require("../config/prisma");

// Función auxiliar: Comprueba si una fecha guardada coincide con "hoy"
const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  );
};

// Función auxiliar: Mezcla un array y extrae 'n' elementos
const getRandomItems = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

class DashboardService {
  static async getDietaDashboard(userId) {
    try {
      // 1. Buscamos el dashboard con los "Me gusta" (recetas) y el plan diario (DailyRecipes)
      const dashboard = await prisma.dashboard.findFirst({
        where: { userId: parseInt(userId) },
        include: {
          user: true,
          dieta: {
            include: {
              recetas: true, // El catálogo de "Me gusta" global del usuario
              DailyRecipes: {
                include: { Recipe: true } // El plan calculado para el día
              }
            }
          }
        }
      });

      if (!dashboard || !dashboard.dieta) {
        throw new Error(`Diet dashboard not found for user: ${userId}`);
      }

      let dailyPlan = dashboard.dieta.DailyRecipes;

      // 2. LÓGICA DE DÍA: ¿Es la primera vez que entra hoy o no hay plan previo?
      if (!dailyPlan || !isToday(dailyPlan.date)) {
        // Extraemos sus recetas favoritas
        const favorites = dashboard.dieta.recetas || [];

        // Seleccionamos hasta 5 recetas aleatorias de sus "Me gusta"
        const selectedRecipes = getRandomItems(favorites, 5);

        // Actualizamos o creamos la tabla DailyRecipes con la fecha de HOY
        dailyPlan = await prisma.dailyRecipes.upsert({
          where: { dashboardDietId: dashboard.dieta.id },
          update: {
            date: new Date(), // Seteamos la fecha a hoy
            Recipe: { set: selectedRecipes.map(r => ({ id: r.id })) } // Sustituimos por el nuevo conjunto
          },
          create: {
            dashboardDietId: dashboard.dieta.id,
            date: new Date(),
            Recipe: { connect: selectedRecipes.map(r => ({ id: r.id })) }
          },
          include: { Recipe: true } // Devolvemos el resultado actualizado
        });
      }

      // 3. Empaquetamos la respuesta adaptada para Angular
      const dietaAdaptada = {
        ...dashboard.dieta,
        calorias_objetivo: dashboard.dieta.calories_goal,
        calorias_totales: dashboard.dieta.calories_total,
        macros1: [
          { nombre: 'Proteínas', valor: 0, progreso: 0, objetivo: dashboard.dieta.protein },
          { nombre: 'Grasas', valor: 0, progreso: 0, objetivo: dashboard.dieta.fats },
          { nombre: 'Carbohidratos', valor: 0, progreso: 0, objetivo: dashboard.dieta.carbs }
        ],
        macros2: [],
        // Enviamos específicamente las 5 recetas correspondientes a HOY
        recetas_del_dia: dailyPlan.Recipe
      };

      return {
        usuario: { id: userId, nombre: dashboard.user.username || `Usuario` },
        dieta: dietaAdaptada
      };
    } catch (error) {
      throw new Error(`Error fetching diet dashboard: ${error.message}`);
    }
  }

  static async getDeporteDashboard(userId) {
    try {
      // 1. Buscamos el dashboard con los "Me gusta" (Exercise) y el plan diario (DailyExercises)
      const dashboard = await prisma.dashboard.findFirst({
        where: { userId: parseInt(userId) },
        include: {
          user: true,
          deporte: {
            include: {
              Exercise: true, // El catálogo de "Me gusta" de ejercicios
              DailyExercises: {
                include: { Exercise: true } // El plan calculado para el día
              }
            }
          }
        }
      });

      if (!dashboard || !dashboard.deporte) {
        throw new Error(`Sport dashboard not found for user: ${userId}`);
      }

      let dailyPlan = dashboard.deporte.DailyExercises;

      // 2. LÓGICA DE DÍA: ¿Es un día nuevo o no existe plan previo?
      if (!dailyPlan || !isToday(dailyPlan.date)) {
        const favorites = dashboard.deporte.Exercise || [];

        // Seleccionamos hasta 5 ejercicios aleatorios
        const selectedExercises = getRandomItems(favorites, 5);

        dailyPlan = await prisma.dailyExercises.upsert({
          where: { dashboardSportId: dashboard.deporte.id },
          update: {
            date: new Date(),
            Exercise: { set: selectedExercises.map(e => ({ id: e.id })) }
          },
          create: {
            dashboardSportId: dashboard.deporte.id,
            date: new Date(),
            Exercise: { connect: selectedExercises.map(e => ({ id: e.id })) }
          },
          include: { Exercise: true }
        });
      }

      // 3. Empaquetamos la respuesta adaptada para Angular
      return {
        usuario: { id: userId, nombre: dashboard.user.username || `Usuario` },
        actividades: [
          { nombre: 'Moverse', valor: `${dashboard.deporte.calories || 0} kcal` },
          { nombre: 'Ejercicio', valor: `${dashboard.deporte.time || 0} min` },
          { nombre: 'De Pie', valor: `0 hr` }
        ],
        deporte: {
          semana: dashboard.deporte.week || [],
          // Enviamos específicamente los 5 ejercicios correspondientes a HOY
          ejercicios_del_dia: dailyPlan.Exercise
        }
      };
    } catch (error) {
      throw new Error(`Error fetching sport dashboard: ${error.message}`);
    }
  }
  static async addFavoriteRecipe(userId, recipeId) {
    const dashboard = await prisma.dashboard.findFirst({
      where: { userId: parseInt(userId) }
    });

    if (!dashboard) throw new Error("Dashboard no encontrado");

    // Añade la receta a la lista global (NO al plan diario, para que funcione como "Me gusta")
    return await prisma.dashboardDiet.update({
      where: { id: dashboard.dashboardDietId },
      data: {
        recetas: {
          connect: { id: parseInt(recipeId) }
        }
      }
    });
  }
}


module.exports = DashboardService;