const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "carproject11",
  database: "car_rental",
});

db.connect((err) => {
  if (err) {
    console.error("Not Connected to DB:", err);
  } else {
    console.log("Successfully connected to MySQL");
  }
});

module.exports = db;
