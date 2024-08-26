const express = require("express");
const router = express.Router(); // Create a new router

const {
  addCity,
  getCities,
  updateCity,
  deleteCity,
} = require("../controllers/cities.controller.js"); // Import controller functions

router.post("/", addCity); // Handle POST requests to add a city

router.get("/", getCities); // Handle GET requests to fetch cities

router.put("/:id", updateCity); // Handle PUT requests to update a city by ID

router.delete("/:id", deleteCity); // Handle DELETE requests to remove a city by ID

module.exports = router;
