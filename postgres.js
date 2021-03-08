var pg = require('pg');

var config = {
  user: process.env.DATABASE_USER,
  database: 'postgres',
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_URL,
  port: 5432,
  max: 10,
  idleTimeoutMillis: 50000,
};

var pool = new pg.Pool(config);
module.exports = pool;