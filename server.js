const express = require("express");
const cors = require("cors");
const { initializeDB } = require("./database.js"); // Import database initialization
const cityRoutes = require("./routes/cities.route.js"); // Import city routes

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

const initializeDBAndServer = async () => {
  try {
    await initializeDB(); // Initialize database
    app.listen(PORT, () => {
      // Start server
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`); // Log DB error
    process.exit(1); // Exit on error
  }
};

initializeDBAndServer(); // Initialize DB and start server

app.use("/cities", cityRoutes); // Set up city routes
