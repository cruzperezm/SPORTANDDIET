const authService = require('../services/auth.service')

const registerUser = async(req, res) => {
    try {
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        } 

        const registeredUser = await authService.register(email, password, "Testing (hardcoded)")
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