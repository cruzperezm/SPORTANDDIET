const { PrismaClient } = require('../generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// 1. Creamos un "Pool" de conexiones estándar usando tu DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// 2. Envolvemos ese pool en el nuevo Adaptador de Prisma
const adapter = new PrismaPg(pool);

// 3. Inicializamos el cliente pasándole OBLIGATORIAMENTE el adaptador (¡Adiós al error!)
const prisma = new PrismaClient({ adapter });

module.exports = prisma;