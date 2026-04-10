const authService = require('../services/auth.service')
const jwt = require('jsonwebtoken');

const registerUser = async(req, res) => {
    try {
        // TODO: Check how to pass username and password as arguments
        // Extract from the body
        const registeredUser = await authService.register(req.body)
        res.status(201).json(registeredUser)
    } catch (error) {
        res.status(400).json({ error: 'Email already exists' })
    }
}

const login = async(req, res) => {
    try {
        const loggedUser = await authService.login(req.body)
        res.status(201),json(loggedUser)
    } catch (error) {
        res.status(400).json({ error: 'The credentials are incorrect' })
    }
}

// NUEVA FUNCIÓN:
const googleCallback = (req, res) => {
    // req.user contiene el usuario que devolvió Passport en el paso anterior
    const user = req.user;

    // Generamos tu JWT de la misma forma que en el login normal
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirigimos al Frontend pasándole el token
    res.redirect('http://localhost:4200/home');
};

// Asegúrate de exportar la nueva función al final del archivo
module.exports = {
    registerUser,
    login,
    googleCallback
};