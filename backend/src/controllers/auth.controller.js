const authService = require('../services/auth.service')

const registerUser = async(req, res) => {
    try {
        
        const { email, username, password } = req.body;
        console.log("Request received (register)");

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        } 

        const registeredUser = await authService.register(email, password, username)
        res.status(201).json(registeredUser)
    } catch (error) {
        console.error("PRISMA ERROR:", error);
        res.status(400).json({ error: error.message })
    }
}

const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Request received (login)");

        const loggedUser = await authService.login(email, password)
        res.status(201).json(loggedUser)

    } catch (error) {
        console.error("PRISMA ERROR:", error);
        if (error.name === 'AuthError') {
            res.status(error.statusCode).json({ error: error.message })
        } else {
            res.status(400).json({ error: error.message })
        }
        
    }
}

module.exports = { registerUser, login }