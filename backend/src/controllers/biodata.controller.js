const { calculateNutrition } = require('../utils/nutrition.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const saveBiodata = async (req, res) => {
    try {
        const ownerId = parseInt(req.body.id) || req.user?.id;
        if (!ownerId) return res.status(400).json({ message: "ID de usuario faltante." });

        const c_weight = Math.round(parseFloat(req.body.cKg));
        const d_weight = Math.round(parseFloat(req.body.dKg));
        const height = parseInt(req.body.height);
        const age = parseInt(req.body.age);
        const weeks = parseInt(req.body.nWeeks);

        const calculatedMetrics = calculateNutrition({
            peso: c_weight,
            altura: height,
            edad: age,
            sexo: (req.body.gender?.toLowerCase() === 'f') ? 'F' : 'M',
            act: req.body.act
        });

        const biometrics = await prisma.biometrics.upsert({
            where: { ownerId: ownerId },
            update: { height, activity: req.body.act, age, c_weight, d_weight, genre: req.body.gender, goal: req.body.goal, weeks, ...calculatedMetrics },
            create: { height, activity: req.body.act, age, c_weight, d_weight, genre: req.body.gender, goal: req.body.goal, weeks, ...calculatedMetrics, ownerId }
        });

        // Apuntamos directamente a DashboardDiet, SIN usar la tabla 'Dashboard'
        const existingDiet = await prisma.dashboardDiet.findUnique({ where: { userId: ownerId } });

        if (!existingDiet) {
            // Creamos la dieta usando exactamente las columnas de tu schema.prisma
            await prisma.dashboardDiet.create({
                data: {
                    userId: ownerId,
                    calories_totales: 0,
                    calories_goal: calculatedMetrics.kcalObjetivo || 2000,
                    protein: calculatedMetrics.macroProteinas || 150,
                    fats: calculatedMetrics.macroGrasas || 60,
                    carbs: calculatedMetrics.macroCarbs || 200,
                    water: 0
                }
            });

            // Creamos el deporte
            await prisma.dashboardSport.create({
                data: {
                    userId: ownerId,
                    week: [],
                    calories: 0,
                    time: 0
                }
            });
        }

        res.status(200).json(biometrics);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};

module.exports = { saveBiodata };