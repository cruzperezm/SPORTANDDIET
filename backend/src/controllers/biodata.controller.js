const authService = require('../services/auth.service');

const saveBiodata = async (req, res) => {
    try {
        const ownerId = parseInt(req.body.id) || req.user?.id;
        if (!ownerId) return res.status(400).json({ message: "ID de usuario faltante." });

        // En lugar de repetir toda la lógica de Prisma aquí,
        // delegamos el trabajo al servicio que ya está corregido.
        const biometrics = await authService.addBio(
            req.body.gender,
            req.body.age,
            req.body.height,
            req.body.goal,
            req.body.act,
            req.body.cKg,
            req.body.dKg,
            req.body.nWeeks,
            ownerId
        );

        res.status(200).json(biometrics);
    } catch (error) {
        console.error("Error al guardar biometría:", error);
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};

module.exports = { saveBiodata };