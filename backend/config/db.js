const path = require('path');
const fs = require('fs');
require('dotenv').config();

let dbInstance = null;
let isSQLite = false;

const driver = (process.env.DB_DRIVER || 'sqlite').toLowerCase();

if (driver === 'mysql') {
  const mysql = require('mysql2/promise');
  dbInstance = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'school_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
  });
  console.log('📡 Using MySQL database connection.');
} else {
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.join(__dirname, '../database/school.sqlite');
  
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const sqliteDb = new sqlite3.Database(dbPath);
  isSQLite = true;
  console.log(`📁 Using SQLite database file: ${dbPath}`);

  // Enable foreign keys in SQLite
  sqliteDb.run('PRAGMA foreign_keys = ON;');

  dbInstance = {
    query: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        // Convert MySQL ON DUPLICATE KEY UPDATE to SQLite ON CONFLICT
        let formattedSql = sql;
        if (formattedSql.toLowerCase().includes('on duplicate key update')) {
          // Keep as is or handle appropriately in migrations/seeds
        }

        const trimmedSql = formattedSql.trim().toLowerCase();
        if (trimmedSql.startsWith('select') || trimmedSql.startsWith('pragma') || trimmedSql.startsWith('show')) {
          sqliteDb.all(formattedSql, params, (err, rows) => {
            if (err) return reject(err);
            resolve([rows, null]);
          });
        } else {
          sqliteDb.run(formattedSql, params, function (err) {
            if (err) return reject(err);
            resolve([{ insertId: this.lastID, affectedRows: this.changes }, null]);
          });
        }
      });
    },
    exec: (sql) => {
      return new Promise((resolve, reject) => {
        sqliteDb.exec(sql, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  };
}

module.exports = {
  query: (sql, params) => dbInstance.query(sql, params),
  exec: (sql) => dbInstance.exec ? dbInstance.exec(sql) : dbInstance.query(sql),
  isSQLite: () => isSQLite
};
