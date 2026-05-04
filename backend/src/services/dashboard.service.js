const prisma = require("../config/prisma");

class DashboardService {
  /**
   * Get diet dashboard data
   */
  static async getDietaDashboard(userId) {
    try {
      const dashboard = await prisma.user.findFirst({
        where: { userId: userId },
        select: {
          userId: true,
        },
        include: {
          dieta: {
            select: {
              id: true,
              calorias_objetivo: true,
              calorias_totales: true,
              macros1: true,
              macros2: true,
              recetas: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!dashboard || !dashboard.dieta) {
        throw new Error(`Diet dashboard not found for user: ${userId}`);
      }

      return {
        usuario: {
          id: userId,
          nombre: `Usuario ${userId.slice(0, 8)}`,
        },
        dieta: dashboard.dieta,
      };
    } catch (error) {
      throw new Error(`Error fetching diet dashboard: ${error.message}`);
    }
  }

  /**
   * Get sport dashboard data
   */
  static async getDeporteDashboard(userId) {
    try {
      const dashboard = await prisma.dashboard.findFirst({
        where: { userId },
        select: {
          userId: true,
        },
        include: {
          deporte: {
            select: {
              id: true,
              actividades: true,
              semana: true,
              ejercicios: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!dashboard || !dashboard.deporte) {
        throw new Error(`Sport dashboard not found for user: ${userId}`);
      }

      return {
        usuario: {
          id: userId,
          nombre: `Usuario ${userId.slice(0, 8)}`,
        },
        actividades: dashboard.deporte.actividades || [],
        deporte: {
          semana: dashboard.deporte.semana || [],
          ejercicios: dashboard.deporte.ejercicios || [],
        },
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
