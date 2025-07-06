const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

// Routes
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/cars"));
app.use("/", require("./routes/admin"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/cart"));


// listen to port 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});