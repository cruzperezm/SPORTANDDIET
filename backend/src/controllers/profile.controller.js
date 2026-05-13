const prisma = require('../config/prisma');

const updateProfile = async (req, res) => {
  try {
    const userId = 1;

    const {
      username, pronouns, allergens,
      age, height, weight, targetWeight, trackingWeeks, activityLevel
    } = req.body;


    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: username,
        pronouns: pronouns,
        allergies: allergens,
      }
    });

    const updatedBiometrics = await prisma.biometrics.upsert({
      where: { ownerId: userId },
      update: {
        age: Number(age),
        height: Number(height),
        c_weight: Number(weight),
        d_weight: Number(targetWeight),
        weeks: Number(trackingWeeks),
        activity: activityLevel
      },
      create: {
        ownerId: userId,
        age: Number(age),
        height: Number(height),
        c_weight: Number(weight),
        d_weight: Number(targetWeight),
        weeks: Number(trackingWeeks),
        activity: activityLevel,
        genre: "NO_ESPECIFICADO",
        goal: "GENERAL"
      }
    });

    res.status(200).json({
      message: "¡Perfil actualizado con éxito!",
      user: updatedUser,
      biometrics: updatedBiometrics
    });

  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ error: "Hubo un error al guardar los cambios en el servidor" });
  }
};

module.exports = {
  updateProfile
};