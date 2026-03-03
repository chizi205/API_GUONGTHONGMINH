require("dotenv").config();
const { Pool } = require("pg");
console.log("DB_NAME =", process.env.DB_NAME);
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD || ""), 
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
