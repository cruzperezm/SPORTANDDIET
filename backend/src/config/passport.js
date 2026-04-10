const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./prisma');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Nota: Esta es la ruta completa a la que redirigirá Google
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const username = profile.displayName;

      // 1. Buscamos si ya existe el usuario por su Google ID
      let user = await prisma.user.findUnique({ where: { googleId } });

      if (!user) {
        // 2. Si no existe por Google ID, ¿existe por email? (Registro previo normal)
        user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          // 3. Si existe, lo actualizamos vinculando su cuenta de Google
          user = await prisma.user.update({
            where: { email },
            data: { googleId }
          });
        } else {
          // 4. Si no existe de ninguna forma, lo registramos (Sign Up)
          user = await prisma.user.create({
            data: {
              email,
              username,
              googleId
              // password se queda en nulo automáticamente
            }
          });
        }
      }

      // Pasamos el usuario al siguiente paso
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;