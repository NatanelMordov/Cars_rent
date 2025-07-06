const express = require("express");
const router = express.Router();
const db = require("../db"); 

// manufacturers
router.get('/manufacturers', (req, res) => {
  const query = 'SELECT DISTINCT manufacturers FROM cars';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('Error fetching data');
    const manufacturers = results.map(row => row.manufacturers);
    res.json(manufacturers);
  });
});

// models by selected manufacturer
router.get('/models', (req, res) => {
  const { manufacturer } = req.query;

  if (!manufacturer) {
    return res.status(400).send('Manufacturer is required');
  }

  const query = 'SELECT DISTINCT model FROM cars WHERE manufacturers = ?';
  db.query(query, [manufacturer], (err, results) => {
    if (err) {
      console.error('Error fetching models from DB:', err);
      return res.status(500).send('Error fetching models');
    }

    const models = results.map(row => row.model);
    res.json(models);
  });
});

/* to get all values of Fuels from DB*/
router.get('/fuels', (req, res) => {
  const query = 'SELECT DISTINCT fuels FROM cars';
  db.query(query, (err, results) => {
    if (err){
      console.error('DB error:', err);
      return res.status(500).send('Error fetching fuel types');
    } 
    const fuels = results.map(row => row.fuels);
    res.json(fuels);
  });
});

/* to get all values of Years from DB*/
router.get('/years', (req, res) => {
  const query = 'SELECT DISTINCT yearsOfProduction FROM cars';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('Error fetching years');
    const years = results.map(row => String(row.yearsOfProduction));

    res.json(years);
  });
});

/* to get all values of Location from DB*/
router.get('/location', (req, res) => {
  const query = 'SELECT DISTINCT location FROM cars';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('Error fetching years');
    const location = results.map(row => String(row.location));

    res.json(location);
  });
});

// get cars
router.get('/cars', (req, res) => {
  console.log('Incoming request to /cars with query:', req.query);
  const { manufactur, model, fuel, year, location} = req.query;

  let query = `
    SELECT *, 
           IFNULL(rating_sum / NULLIF(rating_count, 0), 0) AS averageRating
    FROM cars
  `;
  const conditions = [];
  const params = [];

  if (manufactur) {
    conditions.push('manufacturers = ?');
    params.push(manufactur);
  }

  if (model) {
    conditions.push('model = ?');
    params.push(model);
  }

  if (fuel) {
    conditions.push('fuels = ?');
    params.push(fuel);
  }

  if (year) {
    conditions.push('yearsOfProduction = ?');
    params.push(year);
  }

    if (location) {
    conditions.push('location = ?');
    params.push(location);
  }
  
  // adding the conditions to the query
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching cars from DB:', err);
      return res.status(500).send('Error fetching cars');
    }

    if (!results || results.length === 0) {
      return res.status(404).send('No cars found');
    }

    res.json(results);
  });
});


module.exports = router;
