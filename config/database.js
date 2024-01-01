require("dotenv").config();
const {createPool}=require("mysql");
var pool  = createPool({
    connectionLimit : process.env.DB_CONNECTION_LIMIT,
    host            : process.env.DB_LOCALHOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASSWORD,
    database        : process.env.DB_NAME
  });

  module.exports = pool