const { Pool } = require('pg');
require('dotenv').config();
const ENV = process.env.NODE_ENV || 'development';
console.log(ENV)

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

const config = {};

if (ENV === 'production') {
  console.log("connected in production")
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}
const db = new Pool(config)
module.exports = db