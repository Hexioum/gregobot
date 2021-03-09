var pg = require('pg');

var config = {
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: 5432,
  max: 10,
  idleTimeoutMillis: 50000,
};

var pool = new pg.Pool(config);
module.exports = pool;