const { initializeDB } = require("../database"); // Import DB initialization

const addCity = async (request, response) => {
  const db = await initializeDB(); // Get DB instance
  const { name, population, country, latitude, longitude } = request.body; // Extract data from request body

  // Validate required fields
  if (!name) return response.status(400).json({ message: "Name is required" });
  if (!population)
    return response.status(400).json({ message: "Population is required" });
  if (!country)
    return response.status(400).json({ message: "Country is required" });
  if (!latitude)
    return response.status(400).json({ message: "Latitude is required" });
  if (!longitude)
    return response.status(400).json({ message: "Longitude is required" });

  try {
    const getCityQuery = `SELECT * FROM cities WHERE LOWER(name) = LOWER(?);`;
    const isCityExists = await db.get(getCityQuery, [name]); // Check if city exists

    if (isCityExists) {
      return response
        .status(400)
        .json({ message: "City already exists in the database" });
    } else {
      const addCityQuery = `INSERT INTO cities (name, population, country, latitude, longitude) VALUES (?, ?, ?, ?, ?);`;
      const result = await db.run(addCityQuery, [
        name,
        population,
        country,
        latitude,
        longitude,
      ]); // Add city to DB

      response.status(201).json({
        message: "City added successfully",
        city: {
          id: result.lastID,
          name,
          population,
          country,
          latitude,
          longitude,
        },
      });
    }
  } catch (error) {
    response.status(500).json({ message: error.message }); // Handle server errors
  }
};

const getCities = async (request, response) => {
  const db = await initializeDB(); // Get DB instance
  const {
    page = 1,
    limit = 10,
    filter = "{}",
    sort = "id,asc",
    search = "",
    projection = "*",
  } = request.query; // Extract query parameters

  const pageNumber = parseInt(page, 10); // Parse page number
  const pageSize = parseInt(limit, 10); // Parse page size

  // Validate page and limit
  if (isNaN(pageNumber) || pageNumber < 1)
    return response.status(400).json({ message: "Invalid page number" });
  if (isNaN(pageSize) || pageSize < 1)
    return response.status(400).json({ message: "Invalid limit" });

  let filterCriteria;
  try {
    filterCriteria = JSON.parse(filter); // Parse filter criteria
  } catch (e) {
    return response.status(400).json({ message: "Invalid filter format" });
  }

  // Handle field projection
  const fields =
    projection === "*"
      ? "*"
      : projection
          .split(",")
          .map((field) => `${field.trim()}`)
          .join(", ");

  let query = `SELECT ${fields} FROM cities`; // Base query
  let queryParams = [];

  // Handle search
  if (search) {
    query += ` WHERE LOWER(name) LIKE LOWER(?)`;
    queryParams.push(`%${search}%`);
  }

  // Apply filters
  for (const [key, value] of Object.entries(filterCriteria)) {
    if (search || queryParams.length > 0) {
      query += ` AND`;
    } else {
      query += ` WHERE`;
    }
    query += ` ${key} = ?`;
    queryParams.push(value);
  }

  // Apply sorting
  const [sortField, sortOrder] = sort.split(",");
  if (sortField && sortOrder) {
    query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
  }

  // Apply pagination
  const offset = (pageNumber - 1) * pageSize;
  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(pageSize, offset);

  try {
    const citiesData = await db.all(query, queryParams); // Fetch cities

    response.status(200).json({
      page: pageNumber,
      limit: pageSize,
      data: citiesData,
    });
  } catch (error) {
    response.status(500).json({ message: error.message }); // Handle server errors
  }
};

const updateCity = async (request, response) => {
  const db = await initializeDB(); // Get DB instance
  const { id } = request.params; // Extract city ID
  const { name, population, country, latitude, longitude } = request.body; // Extract update data

  try {
    const getCityQuery = `SELECT * FROM cities WHERE id = ?;`;
    const city = await db.get(getCityQuery, [id]); // Check if city exists

    if (!city) return response.status(404).json({ message: "Invalid city id" });

    if (!name && !population && !country && !latitude && !longitude) {
      return response
        .status(400)
        .json({ message: "At least one field is required for update" });
    }
    const updates = [];
    const updateValues = [];

    // Prepare update query
    if (name) {
      updates.push("name = ?");
      updateValues.push(name);
    }
    if (population) {
      updates.push("population = ?");
      updateValues.push(population);
    }
    if (country) {
      updates.push("country = ?");
      updateValues.push(country);
    }
    if (latitude) {
      updates.push("latitude = ?");
      updateValues.push(latitude);
    }
    if (longitude) {
      updates.push("longitude = ?");
      updateValues.push(longitude);
    }

    updateValues.push(id);

    const updateQuery = `UPDATE cities SET ${updates.join(", ")} WHERE id = ?;`;
    await db.run(updateQuery, updateValues); // Update city in DB

    response.status(200).json({
      message: "City updated successfully",
      city: {
        id,
        name: name || city.name,
        population: population || city.population,
        country: country || city.country,
        latitude: latitude || city.latitude,
        longitude: longitude || city.longitude,
      },
    });
  } catch (error) {
    response.status(500).json({ message: error.message }); // Handle server errors
  }
};

const deleteCity = async (request, response) => {
  const db = await initializeDB(); // Get DB instance
  const { id } = request.params; // Extract city ID

  try {
    const getCityQuery = `SELECT * FROM cities WHERE id = ?;`;
    const isCityExists = await db.get(getCityQuery, [id]); // Check if city exists

    if (!isCityExists)
      return response.status(404).json({ message: "Invalid city id" });

    const deleteCityQuery = "DELETE FROM cities WHERE id = ?;";
    await db.run(deleteCityQuery, [id]); // Delete city from DB
    response.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: error.message }); // Handle server errors
  }
};

module.exports = {
  addCity,
  getCities,
  updateCity,
  deleteCity,
};
