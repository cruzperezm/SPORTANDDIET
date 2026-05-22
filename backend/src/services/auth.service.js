const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const DashboardService = require("./dashboard.service");
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
  const parsedOwner = parseInt(owner);

  // 1. Calcular métricas
  const calculatedMetrics = calculateNutrition({
    peso: parseFloat(c_weight),
    altura: parseInt(height),
    edad: parseInt(age),
    sexo:
      genre?.toLowerCase() === "f" || genre?.toLowerCase() === "mujer"
        ? "F"
        : "M",
    act: activity,
  });

  // 2. Guardar Biometría usando Upsert
  const biometrics = await prisma.biometrics.upsert({
    where: { ownerId: parsedOwner },
    update: {
      genre,
      age: parseInt(age),
      height: parseInt(height),
      goal,
      activity,
      c_weight: Math.round(parseFloat(c_weight)),
      d_weight: Math.round(parseFloat(d_weight)),
      weeks: parseInt(weeks),
      ...calculatedMetrics,
    },
    create: {
      genre,
      age: parseInt(age),
      height: parseInt(height),
      goal,
      activity,
      c_weight: Math.round(parseFloat(c_weight)),
      d_weight: Math.round(parseFloat(d_weight)),
      weeks: parseInt(weeks),
      ownerId: parsedOwner,
      ...calculatedMetrics,
    },
  });

  // 3. Crear los Dashboards
  const existingDiet = await prisma.dashboardDiet.findUnique({
    where: { userId: parsedOwner },
  });

  if (!existingDiet) {
    await prisma.dashboardDiet.create({
      data: {
        userId: parsedOwner,
        calories_total: 0,
        calories_goal: calculatedMetrics.kcalObjetivo || 2000,
        protein: calculatedMetrics.macroProteinas || 150,
        fats: calculatedMetrics.macroGrasas || 60,
        carbs: calculatedMetrics.macroCarbs || 200,
        water: 0,
      },
    });

    await prisma.dashboardSport.create({
      data: {
        userId: parsedOwner,
        week: [],
        calories: 0,
        time: 0,
      },
    });
  }

  try {
    await DashboardService.initializeDailyPlans(parsedOwner);
  } catch (error) {
    console.error("Error inicializando planes tras addBio:", error);
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
    expiresIn: "4Weeks",
  });

  const needsOnboarding = !user.biometrics;

  if (!needsOnboarding) {
    try {
      await DashboardService.initializeDailyPlans(user.id);
    } catch (error) {
      console.error("Error inicializando planes en el login:", error);
    }
  }

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

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secreto_de_emergencia_123",
      {
        expiresIn: "1h",
      },
    );

    const needsOnboarding = !user.biometrics;

    if (!needsOnboarding) {
      try {
        await DashboardService.initializeDailyPlans(user.id);
      } catch (error) {
        console.error("Error inicializando planes en Google Auth:", error);
      }
    }

    return { user, token, needsOnboarding };
  } catch (error) {
    console.error("Error detallado de Google:", error.message);
    throw new AuthError("El token de Google es inválido o ha expirado");
  }
};

// 4. Actualizar las exportaciones
module.exports = { register, login, addBio, googleAuth };
