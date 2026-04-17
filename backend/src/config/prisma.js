const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/client');
require('dotenv').config();

// 1. Creamos un pool de conexiones estándar de Postgres
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Le pasamos el pool al adaptador de Prisma
const adapter = new PrismaPg(pool);

// 3. Inicializamos Prisma usando el adaptador
const prisma = new PrismaClient({ adapter });

module.exports = prisma;