const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/client");
require("dotenv").config();

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
  log: ["query", "info", "warn", "error"],
});

module.exports = prisma;
