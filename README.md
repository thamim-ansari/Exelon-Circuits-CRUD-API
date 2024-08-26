# City Management API

## Overview

The City Management API is a RESTful web service built with Node.js and Express. It provides endpoints to manage cities in a SQLite database. Users can add, retrieve, update, and delete city records.

## Table Schema

The `cities` table in the SQLite database has the following schema:

| Column       | Type    | Description                                                  |
| ------------ | ------- | ------------------------------------------------------------ |
| `id`         | INTEGER | Unique identifier for each city (PRIMARY KEY, AUTOINCREMENT) |
| `name`       | TEXT    | Name of the city (UNIQUE, NOT NULL)                          |
| `population` | INTEGER | Population of the city (NOT NULL)                            |
| `country`    | TEXT    | Country where the city is located (NOT NULL)                 |
| `latitude`   | REAL    | Latitude coordinate of the city (NOT NULL)                   |
| `longitude`  | REAL    | Longitude coordinate of the city (NOT NULL)                  |

## Installation

To get started with the City Management API, follow these steps:

1. **Clone the Repository:**

   ```
   git clone https://github.com/thamim-ansari/Exelon-Circuits-CRUD-API

   cd Exelon-Circuits-CRUD-API
   ```

2. **Install Dependencies:**
   ```
   npm install
   ```
3. **Run the Application:**

   ```
   npm start
   The server will start on http://localhost:3001/.
   ```

## API Endpoints

1. **Add a City**
   - Endpoint: `POST /cities`
   - Description: Adds a new city to the database.
   - Request Body:
     ```
        {
        "name": "CityName",
        "population": 123456,
        "country": "CountryName",
        "latitude": 12.3456,
        "longitude": 65.4321
        }
     ```
   - Responses:
     - 201 Created
       ```
        {
        "message": "City added successfully",
        "city": {
        "id": 1,
        "name": "CityName",
        "population": 123456,
        "country": "CountryName",
        "latitude": 12.3456,
        "longitude": 65.4321
        }
        }
       ```
     - 400 Bad Request for validation errors.
2. **Get Cities**
   - Endpoint: `GET /cities`
   - Description: Retrieves a list of cities with pagination, filtering, and sorting options.
   - Query Parameters:
     - page (default: 1) - Page number for pagination.
     - limit (default: 10) - Number of records per page.
     - filter (default: {}) - JSON string for filtering criteria.
     - sort (default: id,asc) - Field and order for sorting (e.g., name,desc).
     - search (default: "") - Search term for city names.
     - projection (default: \*) - Fields to include in the response.
   - Responses:
     - 200 OK
       ```
        {
        "page": 1,
        "limit": 10,
        "data": [
        {
        "id": 1,
        "name": "CityName",
        "population": 123456,
        "country": "CountryName",
        "latitude": 12.3456,
        "longitude": 65.4321
        }
        // more city objects...
        ]
        }
       ```
     - 400 Bad Request for invalid query parameters.
3. **Update a City**
   - Endpoint: `PUT /cities/:id`
   - Description: Updates the details of a city by its ID.
   - Request Body:
     ```
        {
        "name": "NewCityName",
        "population": 654321,
        "country": "NewCountryName",
        "latitude": 98.7654,
        "longitude": 43.2109
        }
     ```
   - Responses:
     - 200 OK
       ```
        {
        "message": "City updated successfully",
        "city": {
        "id": 1,
        "name": "NewCityName",
        "population": 654321,
        "country": "NewCountryName",
        "latitude": 98.7654,
        "longitude": 43.2109
        }
        }
       ```
     - 400 Bad Request for invalid update data.
     - 404 Not Found if the city ID does not exist.
4. **Delete a City**

- Endpoint: `DELETE /cities/:id`
- Description: Deletes a city by its ID.
- Responses:
  - 200 OK
    ```
     {
     "message": "City deleted successfully"
     }
    ```
  - 404 Not Found if the city ID does not exist.

#### Error Handling

The API provides appropriate HTTP status codes and JSON error messages for various scenarios, including validation errors, server errors, and not found errors.

#### Sample Data

Here is some sample data you can use to test the API:

- Add a City Request:

  ```
    {
    "name": "New York",
    "population": 8419000,
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060
    }
  ```

- Update City Request:

  ```
   {
   "name": "New York City",
   "population": 8500000
   }
  ```
