const prisma = require("../config/prisma");

class DashboardService {
  static async getDietaDashboard(userId) {
    try {
      // La búsqueda correcta es a través del modelo Dashboard
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

      return {
        usuario: { id: userId, nombre: dashboard.user.username || `Usuario` },
        dieta: dashboard.dieta
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
          { nombre: 'Moverse', valor: `${dashboard.deporte.actividades} kcal` },
          { nombre: 'Ejercicio', valor: `${dashboard.deporte.ejercicios} min` },
          { nombre: 'De Pie', valor: `0 hr` }
        ],
        deporte: { semana: [], ejercicios: [] }
      };
    } catch (error) {
      throw new Error(`Error fetching sport dashboard: ${error.message}`);
    }
  }

  /**
   * Update or create dashboard data
   */
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
