const prisma = require("../config/prisma");

class DashboardService {
  static async getDietaDashboard(userId) {
    try {
      const dashboard = await prisma.dashboard.findFirst({
        where: { userId: parseInt(userId) },
        include: {
          user: true,
          dieta: {
            include: { recetas: true }
          }
        }
      });

      if (!dashboard || !dashboard.dieta) {
        throw new Error(`Diet dashboard not found for user: ${userId}`);
      }

      // Empaquetamos las columnas sueltas en la estructura que espera tu Frontend
      const dietaAdaptada = {
        ...dashboard.dieta,
        calorias_objetivo: dashboard.dieta.calories_goal,
        calorias_totales: dashboard.dieta.calories_total,
        macros1: [
          { nombre: 'Proteínas', valor: 0, progreso: 0, objetivo: dashboard.dieta.protein },
          { nombre: 'Grasas', valor: 0, progreso: 0, objetivo: dashboard.dieta.fats },
          { nombre: 'Carbohidratos', valor: 0, progreso: 0, objetivo: dashboard.dieta.carbs }
        ],
        macros2: []
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
      const dashboard = await prisma.dashboard.findFirst({
        where: { userId: parseInt(userId) },
        include: {
          user: true,
          deporte: true
        }
      });

      if (!dashboard || !dashboard.deporte) {
        throw new Error(`Sport dashboard not found for user: ${userId}`);
      }

      return {
        usuario: { id: userId, nombre: dashboard.user.username || `Usuario` },
        actividades: [
          { nombre: 'Moverse', valor: `0 kcal` },
          { nombre: 'Ejercicio', valor: `0 min` },
          { nombre: 'De Pie', valor: `0 hr` }
        ],
        // Mapeamos el campo week que ahora es un array según tu bbdd
        deporte: { semana: dashboard.deporte.week || [], ejercicios: [] }
      };
    } catch (error) {
      throw new Error(`Error fetching sport dashboard: ${error.message}`);
    }
  }

  static async upsertDashboard(userId, dashboardData) {
    try {
      const dashboard = await prisma.dashboard.upsert({
        where: { userId },
        update: dashboardData,
        create: {
          userId,
          ...dashboardData,
        },
        include: {
          dieta: true,
          deporte: true,
        },
      });

      return dashboard;
    } catch (error) {
      throw new Error(`Error upserting dashboard: ${error.message}`);
    }
  }
}
module.exports = DashboardService;
