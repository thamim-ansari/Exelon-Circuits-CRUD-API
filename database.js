const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "ExelonCircuits.db"); // Define the database path

let db = null; // Initialize the db variable

const initializeDB = async () => {
  if (db) return db; // Return existing db instance if already initialized
  db = await open({
    // Open a new database connection
    filename: dbPath,
    driver: sqlite3.Database,
  });
  return db; // Return the db instance
};

module.exports = {
  initializeDB, // Export initializeDB function
};
