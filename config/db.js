const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres",
  database: "bancosolar",
  port: 5432,
});

module.exports = pool;
