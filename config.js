'use strict';

const DATABASE_URL = 'postgresql://dev:dev@localhost/dev-restaurants-app';

//process.env.DATABASE_URL || global.DATABASE_URL || 
// postgres://USERNAME:PASSWORD@stampy.db.elephantsql.com:5432/DATABASE

exports.DATABASE = {
  client: 'pg',
  connection: DATABASE_URL,
  // debug: true
};

exports.PORT = process.env.PORT || 8080; 



// Require Knex and make connection
// const knex = require('knex')({
//   client: 'pg',
//   connection: {
//     database: 'dev-restaurants-app'
//   },
// });

// If you're using ElephantSQL then the connection will look like this
/*
const knex = require('knex')({
  client: 'pg',
  connection:'postgres://USERNAME:PASSWORD@stampy.db.elephantsql.com:5432/DATABASE'
}
*/
