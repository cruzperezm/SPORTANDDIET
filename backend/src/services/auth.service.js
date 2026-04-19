const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// 1. Importar la librería de Google
const { OAuth2Client } = require('google-auth-library');

// 2. Inicializar el cliente de Google (¡Esta es la línea que falta!)
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
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

const addBio = async (genre, age, height, goal, activity, c_weight, d_weight, weeks, owner) => {

  return await prisma.biometrics.create({
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
    },
  });
};

const login = async (email, password) => {
  // 1. Añadimos include: { biometrics: true } para traer sus datos físicos
  const user = await prisma.user.findUnique({
    where: { email },
    include: { biometrics: true }
  });

  if (!user) throw new AuthError('A user with this email does not exist');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthError('The password is incorrect');

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // 2. Evaluamos si le faltan los datos biométricos
  const needsOnboarding = !user.biometrics;

  // 3. Devolvemos el chivato al frontend
  return { user, token, needsOnboarding };
};

// 3. NUEVO SERVICIO: Autenticación por Google
const googleAuth = async (idToken) => {
  try {
    const { OAuth2Client } = require('google-auth-library');
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId, name: username } = payload;

    // 1. Añadimos include: { biometrics: true }
    let user = await prisma.user.findUnique({
      where: { email },
      include: { biometrics: true }
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email, username, googleId },
        include: { biometrics: true } // Aunque sabemos que aquí será null
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { email },
        data: { googleId },
        include: { biometrics: true }
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 2. Evaluamos si le faltan los datos biométricos
    const needsOnboarding = !user.biometrics;

    // 3. Devolvemos el chivato
    return { user, token, needsOnboarding };
  } catch (error) {
    console.error("Error detallado de Google:", error.message);
    throw new AuthError('El token de Google es inválido o ha expirado');
  }
};

// 4. Actualizar las exportaciones
module.exports = { register, login, addBio, googleAuth };