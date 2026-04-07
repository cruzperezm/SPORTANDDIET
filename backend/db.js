// Base de datos (PostgreSQL)
import "dotenv/config"
var pgp = require('pg-promise')();

const connectionString = process.env.PGCONNECT
const db = pgp(connectionString)

module.exports = db;