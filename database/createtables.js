const sqlite = require("better-sqlite3");
const { schema } = require("./schema.js");

const DB = new sqlite("./nepalidb.sqlite");

DB.exec(schema);

module.exports = DB;
