const express = require("express");
const router = express.Router();
const db = require("../db"); 

// get all pending orders for a specific user, including car details
router.get('/cart/:username', (req, res) => {
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
router.get('/full-cart/:username', (req, res) => {
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
      cars.location,
      cart.rating
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
router.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM cart WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).send('Failed to delete cart');
    res.sendStatus(200);
  });
});


///////////Remove Item after buying/////////
router.delete('/completed-order/:id', async (req, res) => {
  const { id } = req.params;
  console.log('DELETE /completed-order/:id called with id:', req.params.id);

  // first step: get order details includingusername and totalprice
  const getQuery = 'SELECT username, totalprice FROM cart WHERE id = ? AND status = "completed"';
  db.query(getQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch order");
    if (results.length === 0) return res.status(404).send("Completed order not found");

    const { username, totalprice } = results[0];

    // step 2: update points for this user in users table
    const updatePointsQuery = 'UPDATE users SET points = points + ? WHERE username = ?';
    db.query(updatePointsQuery, [totalprice, username], (err2) => {
      if (err2) return res.status(500).send("Failed to update user points");

      // step 3: delete (remove) order from cart table
      const deleteQuery = 'DELETE FROM cart WHERE id = ?';
      db.query(deleteQuery, [id], (err3) => {
        if (err3) return res.status(500).send("Failed to delete order");
        res.sendStatus(200);
      });
    });
  });
});

/////////////////CHECKOUT//////////////////
// update status in cart table to complete///
router.post("/cart/update-status", (req, res) => {
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
router.post('/cart/add-order', (req, res) => {
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


module.exports = router;
