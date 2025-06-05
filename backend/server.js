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





// get user profile
app.get('/profile', (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).send('Username is required');

  const query = 'SELECT username, email, is_admin, points FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).send('Error fetching user profile');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(results[0]);
  });
});

// update user profile
app.put('/profile', (req, res) => {
  const { username, email, newPassword } = req.body;

  if (!username) return res.status(400).send('Username is required');
  if (!email && !newPassword) return res.status(400).send('Nothing to update');

  const updates = [];
  const params = [];

  if (email) {
    updates.push('email = ?');
    params.push(email);
  }

  if (newPassword) {
    updates.push('password = ?');
    params.push(newPassword); // Note: Consider hashing in production
  }

  params.push(username);

  const query = `UPDATE users SET ${updates.join(', ')} WHERE username = ?`;

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).send('Error updating profile');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('Profile updated successfully');
  });
});

/////////////////////////////////ORDERS//////////////////////
// get all pending orders for a specific user, including car details
app.get('/cart/:username', (req, res) => {
  const { username } = req.params;

  const query = `
    SELECT 
      cart.id AS cartId,
      cart.start_date,
      cart.end_date,
      cart.totalprice,
      cart.status,
      cars.id AS carId,
      cars.manufacturers,
      cars.model,
      cars.yearsOfProduction,
      cars.fuels,
      cars.gear,
      cars.priceperday,
      cars.location
    FROM cart
    JOIN cars ON cart.car_id = cars.id
    WHERE cart.username = ? AND cart.status = 'pending'
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching cart data:', err);
      return res.status(500).send('Error fetching cart data');
    }

    if (results.length === 0) {
      return res.status(404).send('No pending orders found for this user');
    }

    res.json(results);
  });
});


// get all orders for a specific user, including car details
app.get('/full-cart/:username', (req, res) => {
  const { username } = req.params;

  const query = `
    SELECT 
      cart.id AS cartId,
      cart.start_date,
      cart.end_date,
      cart.totalprice,
      cart.status,
      cars.id AS carId,
      cars.manufacturers,
      cars.model,
      cars.yearsOfProduction,
      cars.fuels,
      cars.gear,
      cars.priceperday,
      cars.location
    FROM cart
    JOIN cars ON cart.car_id = cars.id
    WHERE cart.username = ?
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching cart data:', err);
      return res.status(500).send('Error fetching cart data');
    }

    if (results.length === 0) {
      return res.status(404).send('No pending orders found for this user');
    }

    res.json(results);
  });
});


////////// remove item from cart//////////
app.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM cart WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).send('Failed to delete cart');
    res.sendStatus(200);
  });
});


/////// GET POINTS PER USERNAME/////////
app.get("/users/points/:username", (req, res) => {
  const { username } = req.params;

  const query = "SELECT points FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error fetching user points:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ points: results[0].points });
  });
});

/////////////////CHECKOUT//////////////////
// update status in cart table to complete///
app.post("/cart/update-status", (req, res) => {
  const { cartIds, pointsUsed, totalAmount } = req.body;
  console.log("Received cartIds:", cartIds, pointsUsed, totalAmount);

  if (!Array.isArray(cartIds) || cartIds.length === 0) {
    return res.status(400).json({ message: "No cart IDs provided" });
  }

  const placeholders = cartIds.map(() => "?").join(",");
  const updateCartQuery = `UPDATE cart SET status = 'completed' WHERE id IN (${placeholders})`;

  db.query(updateCartQuery, cartIds, (err, result) => {
    if (err) {
      console.error("Error updating cart status:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Get username
    const getUsernameQuery = `SELECT username FROM cart WHERE id = ? LIMIT 1`;
    db.query(getUsernameQuery, [cartIds[0]], (err, userResult) => {
      if (err || !userResult.length) {
        console.error("Error fetching username:", err);
        return res.status(500).json({ message: "Failed to retrieve username" });
      }

      const username = userResult[0].username;

      // Get car IDs
      const getCarIdsQuery = `SELECT car_id FROM cart WHERE id IN (${placeholders})`;
      db.query(getCarIdsQuery, cartIds, (err, carResults) => {
        if (err) {
          console.error("Error retrieving car IDs:", err);
          return res.status(500).json({ message: "Failed to retrieve car IDs" });
        }

        const carIds = carResults.map(row => row.car_id);

        if (carIds.length === 0) {
          return res.json({ message: "Cart updated but no cars found" });
        }

        const updateCarQuery = `
          UPDATE cars 
          SET inventory = inventory - 1 
          WHERE id IN (${carIds.map(() => "?").join(",")})`;

        db.query(updateCarQuery, carIds, (err, carUpdateResult) => {
          if (err) {
            console.error("Error updating car quantities:", err);
            return res.status(500).json({ message: "Failed to update car stock" });
          }

          // Update points if used
          if (pointsUsed && pointsUsed > 0) {
            const updatePointsQuery = `UPDATE users SET points = points - ? WHERE username = ?`;

            db.query(updatePointsQuery, [pointsUsed, username], (err, pointsResult) => {
              if (err) {
                console.error("Error updating user points:", err);
                return res.status(500).json({ message: "Failed to update user points" });
              }
              
              addBonusPoints(username, totalAmount, res);
            });
          } else {
            addBonusPoints(username, totalAmount, res);
          }
        });
      });
    });
  });
});
function addBonusPoints(username, totalAmount, res) {
  const bonusPoints = Math.floor(totalAmount * 0.1); // 10% from the total amount to pay
  const updateBonusQuery = `UPDATE users SET points = points + ? WHERE username = ?`;

  db.query(updateBonusQuery, [bonusPoints, username], (err) => {
    if (err) {
      console.error("Error adding bonus points:", err);
      return res.status(500).json({ message: "Failed to add bonus points" });
    }

    return res.json({
      message: "Cart, car inventory, and user points updated successfully with bonus"
    });
  });
}


//////ADD A NEW ORDER//////////
app.post('/cart/add-order', (req, res) => {
  const { username, car_id, start_date, end_date, totalprice } = req.body;
  console.log("Received:", username, car_id, start_date, end_date, totalprice);

  const query = `INSERT INTO cart (username, car_id, start_date, end_date, totalprice, status)
                 VALUES (?, ?, ?, ?, ?, 'pending')`;

  db.query(query, [username, car_id, start_date, end_date, totalprice], (err, result) => {
    if (err) {
      console.error('Error inserting into cart:', err);
      return res.status(500).send('Error adding to cart');
    }

    res.status(201).json({
      id: result.insertId,
      username,
      car_id,
      start_date,
      end_date,
      totalprice
    });
  });
});

// listen to port 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});