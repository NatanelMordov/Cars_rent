const express = require("express");
const router = express.Router();
const db = require("../db"); 


 // To allow admin to add a new car
router.post('/cars', (req, res) => {
  const { manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory } = req.body;
  const query = 'INSERT INTO cars (manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory], (err, result) => {
    if (err) return res.status(500).send('Failed to add car');
    res.status(201).json({id: result.insertId,manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory });
  });
});

// To allow admin to update a car
router.put('/cars/:id', (req, res) => {
  const { id } = req.params;
  const { manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory } = req.body;
  const query = 'UPDATE cars SET manufacturers = ?, model = ?, yearsOfProduction = ?, fuels = ?, gear = ?, priceperday = ?, location = ?, inventory = ?  WHERE id = ?';
  db.query(query, [manufacturers, model, yearsOfProduction, fuels, gear, priceperday, location, inventory, id], (err) => {
    if (err) return res.status(500).send('Failed to update car');
    res.sendStatus(200);
  });
});

// To allow admin to delete a car
router.delete('/cars/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM cars WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).send('Failed to delete car');
    res.sendStatus(200);
  });
});





module.exports = router;
