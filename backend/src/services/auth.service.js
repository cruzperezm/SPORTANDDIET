const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

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

const jwt = require('jsonwebtoken');

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) throw new Error('A user with this email does not exist');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('The password is incorrect');

  const token = jwt.sign(
    { userId: user.id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );

  return { user, token };
};

module.exports = { register, login }