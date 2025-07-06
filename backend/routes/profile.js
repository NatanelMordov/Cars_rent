const express = require("express");
const router = express.Router();
const db = require("../db"); 


// get user profile
router.get('/profile', (req, res) => {
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
router.put('/profile', (req, res) => {
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

/////////Add Rating for each past order/////
router.post("/rate", (req, res) => {
  const { carId, rating, cartId } = req.body;

  if (!carId || !rating || rating < 1 || rating > 5 || !cartId) {
    return res.status(400).send("Invalid rating data");
  }

  db.query(
    "UPDATE cars SET rating_sum = rating_sum + ?, rating_count = rating_count + 1 WHERE id = ?",
    [rating, carId],
    (err1) => {
      if (err1) {
        console.error("Error updating car rating:", err1);
        return res.status(500).send("Error updating car rating");
      }

      db.query(
        "UPDATE cart SET rating = ? WHERE id = ?",
        [rating, cartId],
        (err2) => {
          if (err2) {
            console.error("Error saving rating to cart:", err2);
            return res.status(500).send("Error saving rating to cart");
          }

          res.send("Rating saved successfully");
        }
      );
    }
  );
});

/////// GET POINTS PER USERNAME/////////
router.get("/users/points/:username", (req, res) => {
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

module.exports = router;
