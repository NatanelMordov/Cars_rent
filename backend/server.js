const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

// connection to DB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'carproject11',
  database: 'car_rental'
});

db.connect((err) => {
  if (err) {
    console.error('Not Connected to DB:', err);
    return;
  }
  console.log('Successfully connected to MySQL');
});

// log in
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, result) => {
    if (err) return res.status(500).send('Error in server');
    if (result.length === 0) return res.status(404).send('User not found');
    //if this user is exsist -> get is_Admin value
    const user = result[0];
    const { username, is_admin } = user; // get username and is admin
    // return the username and is admin as a JSON
    res.status(200).json({
      username,
      isAdmin: is_admin ? true : false  // if is_admin = true
    });
  });
});


// sign up
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const checkQuery = 'SELECT * FROM users WHERE email = ?';

  db.query(checkQuery, [email], (err, result) => {
    if (err) return res.status(500).send('Error in server');
    if (result.length > 0) return res.status(400).send('Email already in use');

    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) return res.status(500).send('Error in server');
      res.status(201).send('User created successfully');
    });
  });
});

// manufacturers
app.get('/manufacturers', (req, res) => {
  const query = 'SELECT DISTINCT manufacturers FROM cars';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('Error fetching data');
    const manufacturers = results.map(row => row.manufacturers);
    res.json(manufacturers);
  });
});

// models by selected manufacturer
app.get('/models', (req, res) => {
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
app.get('/fuels', (req, res) => {
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
app.get('/years', (req, res) => {
  const query = 'SELECT DISTINCT yearsOfProduction FROM cars';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('Error fetching years');
    const years = results.map(row => String(row.yearsOfProduction));

    res.json(years);
  });
});

/* to get all values of Location from DB*/
app.get('/location', (req, res) => {
  const query = 'SELECT DISTINCT location FROM cars';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('Error fetching years');
    const location = results.map(row => String(row.location));

    res.json(location);
  });
});

// get cars
app.get('/cars', (req, res) => {
  console.log('Incoming request to /cars with query:', req.query);
  const { manufactur, model, fuel, year, location} = req.query;

  let query = 'SELECT * FROM cars';
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


// To allow admin to add a new car
app.post('/cars', (req, res) => {
  const { manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory } = req.body;
  const query = 'INSERT INTO cars (manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory], (err, result) => {
    if (err) return res.status(500).send('Failed to add car');
    res.status(201).json({id: result.insertId,manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory });
  });
});

// To allow admin to update a car
app.put('/cars/:id', (req, res) => {
  const { id } = req.params;
  const { manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory } = req.body;
  const query = 'UPDATE cars SET manufacturers = ?, model = ?, yearsOfProduction = ?, fuels = ?, gear = ?, priceperday = ?, location = ?, inventory = ?  WHERE id = ?';
  db.query(query, [manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory, id], (err) => {
    if (err) return res.status(500).send('Failed to update car');
    res.sendStatus(200);
  });
});

// To allow admin to delete a car
app.delete('/cars/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM cars WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).send('Failed to delete car');
    res.sendStatus(200);
  });
});


// listen to port 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
