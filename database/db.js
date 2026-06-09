const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, 'khatabook.db');
const db = new Database(dbPath, { verbose: console.log });

module.exports = db;
