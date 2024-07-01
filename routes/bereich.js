var express = require('express');
var router = express.Router();

const { pool } = require('../index');  // Datenbank-Pool

// Bereiche auslesen
router.get('/api/bereich', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM bereich');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Werte eines einzelnen Bereiches lesen
router.get('/api/bereich/:id', async (req, res) => {
const { id } = req.params;
let conn;
try {
  conn = await pool.getConnection();
  const [bereich] = await conn.query('SELECT * FROM bereich WHERE bereich_id = ?', [id]);
  if (!bereich) {
    return res.status(404).json({ message: 'Area not found' });
  }
  res.json(bereich);
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
} finally {
  if (conn) conn.release();
}
});

// Einen neuen Bereich hinzufügen
router.post('/api/bereich', async (req, res) => {
  const { bereich_name, bereich_aktiv, bereich_aktiv_seit } = req.body;
  
  if (!bereich_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO bereich (bereich_name, bereich_aktiv, bereich_aktiv_seit) VALUES (?, ?, ?)',
      [bereich_name, bereich_aktiv, bereich_aktiv_seit]
    );
    res.status(201).json({ message: 'Area created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen Bereich aktualisieren
router.put('/api/bereich/:id', async (req, res) => {
  const { id } = req.params;
  const { bereich_name, bereich_aktiv, bereich_aktiv_seit, bereich_inaktiv_seit } = req.body;
  console.error(req.body);
  
  if (!bereich_name) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'UPDATE bereich SET bereich_name = ?, bereich_aktiv = ?, bereich_aktiv_seit = ?, bereich_inaktiv_seit = ? WHERE bereich_id = ?',
      [bereich_name, bereich_aktiv, bereich_aktiv_seit, bereich_inaktiv_seit, id]
    );
    res.status(200).json({ message: 'Area updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen Bereich löschen
router.delete('/api/bereich/:id', async (req, res) => {
const { id } = req.params;
if (!id) {
  return res.status(400).json({ message: 'Missing required fields' });
}
let conn;
try {
  conn = await pool.getConnection();
  await conn.query(
    'DELETE from bereich where bereich_id = ?', [id]
    );
    res.status(200).json({ message: 'Area deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
