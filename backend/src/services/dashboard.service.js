const prisma = require("../config/prisma");
const { dmmfToRuntimeDataModel } = require("../generated/runtime/client");

class DashboardService {
  /**
   * Get diet dashboard data
   */
  static async getDietaDashboard(userId) {
    try {
      return await prisma.dashboardDiet.findFirst({
        where: { userId: userId },
        select: {
          calories_total: true,
          calories_goal: true,
          protein: true,
          fats: true,
          carbs: true,
          water: true,
          updatedAt: true,
          recipes: {
            select: { name: true, image: true, calories: true },
          },
        },
      });
    } catch (error) {
      throw new Error(`Error fetching diet dashboard: ${error.message}`);
    }
  }

  /**
   * Get sport dashboard data
   */
  static async getDeporteDashboard(userId) {
    try {
      let deporteDashboard = await prisma.dashboardSport.findFirst({
        where: { userId: userId },
        select: {
          userId: true,
          week: true,
          updatedAt: true,
          calories: true,
          time: true,
          exercises: {
            select: { name: true, image: true, duration: true },
          },
        },
      });

      let week = [
        { dia: "L", valor: 0 },
        { dia: "M", valor: 0 },
        { dia: "X", valor: 0 },
        { dia: "J", valor: 0 },
        { dia: "V", valor: 0 },
        { dia: "S", valor: 0 },
        { dia: "D", valor: 0 },
      ];

      if (deporteDashboard.week === []) {
        deporteDashboard.week = week;
      } else {
        for (let i = 0; i < 7; i++) {
          let day = deporteDashboard.week[i];
          week[i].valor = day;
        }
        deporteDashboard.week = week;
      }
      return deporteDashboard;
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
