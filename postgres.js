var pg = require('pg');

var config = {
  user: process.env.DATABASE_USER,
  database: 'd6gsu9s8kj5k1r',
  password: process.env.DATABASE_PASSWORD,
  host: 'ec2-50-19-247-157.compute-1.amazonaws.com',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 50000,
};

var pool = new pg.Pool(config);
module.exports = pool;