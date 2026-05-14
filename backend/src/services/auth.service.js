const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { calculateNutrition } = require("../utils/nutrition.js");

const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    this.statusCode = 401;
  }
}

const register = async (email, password, username) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });
};

const addBio = async (
  genre,
  age,
  height,
  goal,
  activity,
  c_weight,
  d_weight,
  weeks,
  owner,
) => {
  // Calculate nutrition metrics
  const calculatedMetrics = calculateNutrition({
    peso: c_weight,
    altura: height,
    edad: age,
    sexo: (genre?.toLowerCase() === 'f') ? 'F' : 'M',
    act: activity
  });

  // Create biometrics with calculated metrics
  const biometrics = await prisma.biometrics.create({
    data: {
      genre,
      age,
      height,
      goal,
      activity,
      c_weight,
      d_weight,
      weeks,
      ownerId: owner,
      ...calculatedMetrics
    },
  });

  // Initialize dashboard for new users
  const existingDashboard = await prisma.dashboard.findFirst({ where: { userId: owner } });
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
      data: { userId: owner, dashboardDietId: diet.id, dashboardSportId: sport.id }
    });
  }

  return biometrics;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { biometrics: true },
  });

  if (!user) throw new AuthError("A user with this email does not exist");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthError("The password is incorrect");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const needsOnboarding = !user.biometrics;

  return { user, token, needsOnboarding };
};

const googleAuth = async (idToken) => {
  try {
    const { OAuth2Client } = require("google-auth-library");
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId, name: username } = payload;

    let user = await prisma.user.findUnique({
      where: { email },
      include: { biometrics: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email, username, googleId },
        include: { biometrics: true },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { email },
        data: { googleId },
        include: { biometrics: true },
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const needsOnboarding = !user.biometrics;

    return { user, token, needsOnboarding };
  } catch (error) {
    console.error("Error detallado de Google:", error.message);
    throw new AuthError("El token de Google es inválido o ha expirado");
  }
};

// 4. Actualizar las exportaciones
module.exports = { register, login, addBio, googleAuth };
