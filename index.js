require('dotenv').config()
const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
// Initialisieren und umgebungsspezifische Konfiguration einlesen

const app = express();
const port = process.env.API_PORT;

// Datenbankverbindung herstellen
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT
});

// Dantenbank-Pool exportieren, damit die Routes darauf zugreifen können
module.exports.pool = pool;

// Middleware
app.use(bodyParser.json());
// Die Routes, die die jeweils aufgerufenen Pfade beantworten
app.use(require('./routes/bereich'));
app.use(require('./routes/raum'));
app.use(require('./routes/hub'));
app.use(require('./routes/beacon'));
app.use(require('./routes/mp'));
app.use(require('./routes/mp_mapping'));
app.use(require('./routes/mp_typ'));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
