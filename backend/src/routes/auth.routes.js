const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport'); // <-- Importar passport

// Tus rutas originales
router.post('/register', authController.registerUser); // Nota: lo cambie de register a registerUser basado en tu controlador
router.post('/login', authController.login);

// NUEVAS RUTAS GOOGLE:
// 1. Angular llamará aquí para enviar al usuario a la página de Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// 2. Google devolverá al usuario aquí con sus datos
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
);

module.exports = router;