const authService = require('../services/auth.service')

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