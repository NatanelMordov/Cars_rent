const express = require("express");
const router = express.Router();
const db = require("../db"); 


// log in
router.post('/login', (req, res) => {
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
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const checkQuery = 'SELECT * FROM users WHERE email = ?';

  db.query(checkQuery, [email], (err, result) => {
    if (err) return res.status(500).send('Error in server');
    if (result.length > 0) return res.status(400).send('Email already in use');

    const insertQuery = 'INSERT INTO users (username, email, password, points) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [name, email, password, 150], (err, result) => {
      if (err) return res.status(500).send('Error in server');
      res.status(201).send('User created successfully');
    });
  });
});

module.exports = router;
