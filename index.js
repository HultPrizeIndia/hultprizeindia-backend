const express = require('express');
const Sequelize = require('sequelize');

// Backend Variables
const SERVER_NAME = "HultPrizeIndia";
const SERVER_PORT = process.env.PORT || 3000;

// Database Variables
const DB_USERNAME = process.env.DB_USERNAME || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'raghav2011';
const DB_NAME = process.env.DB_NAME || 'hultIndia';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

// Setup Database
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql'    /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });

// Check if connection to db was established.
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
})
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

// Setup backend
const app = express();
const Op = Sequelize.Op;
app.use(express.json());




// For any other req.
app.use((req, res) => {
    res.status(404);
    res.json({"error":"404"});
});


app.listen(SERVER_PORT, () => {
    console.log(SERVER_NAME + " backend started listening on port: " + SERVER_PORT);
});