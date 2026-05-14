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

        const existingDashboard = await prisma.dashboard.findFirst({ where: { userId: ownerId } });
        if (!existingDashboard) {
            const diet = await prisma.dashboardDiet.create({
                data: {
                    calorias_totales: 0,
                    calorias_objetivo: calculatedMetrics.kcalObjetivo,
                    macros1: [
                        { nombre: 'Proteínas', valor: 0, progreso: 0, objetivo: calculatedMetrics.macroProteinas },
                        { nombre: 'Grasas', valor: 0, progreso: 0, objetivo: calculatedMetrics.macroGrasas },
                        { nombre: 'Carbohidratos', valor: 0, progreso: 0, objetivo: calculatedMetrics.macroCarbs }
                    ],
                    macros2: []
                }
            });

            const sport = await prisma.dashboardSport.create({ data: { actividades: 0, semana: weeks, ejercicios: 0 } });

            await prisma.dashboard.create({
                data: { userId: ownerId, dashboardDietId: diet.id, dashboardSportId: sport.id }
            });
        }

        res.status(200).json(biometrics);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};

module.exports = { saveBiodata };