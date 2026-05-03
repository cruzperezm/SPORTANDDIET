const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserId = (req) => {
    return req.query.userId || req.headers['x-user-id'] || 'demo-user';
};

// 🥗 DIETA - SOLO LECTURA
exports.getDietaDashboard = async (req, res) => {
    try {
        const userId = getUserId(req);

        const dashboard = await prisma.dashboard.findFirst({
            where: { userId },
            select: {
                dieta: {
                    select: {
                        calorias_objetivo: true,
                        calorias_totales: true,
                        macros1: true,
                        macros2: true,
                        recetas: true
                    }
                }
            }
        });

        if (!dashboard?.dieta) {
            return res.status(404).json({
                error: `No dieta dashboard found for user: ${userId}`
            });
        }

        res.json({
            usuario: {
                nombre: req.user?.name || `Usuario ${userId.slice(0,8)}`,
                id: userId
            },
            dieta: dashboard.dieta
        });
    } catch (error) {
        console.error('GET dieta error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// 🏋️ DEPORTE - SOLO LECTURA
exports.getDeporteDashboard = async (req, res) => {
    try {
        const userId = getUserId(req);

        const dashboard = await prisma.dashboard.findFirst({
            where: { userId },
            select: {
                deporte: {
                    select: {
                        actividades: true,
                        semana: true,
                        ejercicios: true
                    }
                }
            }
        });

        if (!dashboard?.deporte) {
            return res.status(404).json({
                error: `No deporte dashboard found for user: ${userId}`
            });
        }

        res.json({
            usuario: {
                nombre: req.user?.name || `Usuario ${userId.slice(0,8)}`,
                id: userId
            },
            actividades: dashboard.deporte.actividades || [],
            deporte: {
                semana: dashboard.deporte.semana || [],
                ejercicios: dashboard.deporte.ejercicios || []
            }
        });
    } catch (error) {
        console.error('GET deporte error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};