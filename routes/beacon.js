var express = require('express');
var router = express.Router();

const { pool } = require('../index');  // Datenbank-Pool

// Beacons auslesen
router.get('/api/beacon', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM beacon_raum_bereich');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching beacons: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Werte eines einzelnen Beacons lesen
router.get('/api/beacon/:id', async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const [beacon] = await conn.query('SELECT * FROM beacon_raum_bereich WHERE beacon_id = ?', [id]);
    if (!beacon) {
      return res.status(404).json({ message: 'Beacon not found' });
    }
    res.json(beacon);
  } catch (err) {
    console.error("Error fetching beacon by id: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen Beacon aktualisieren
router.put('/api/beacon/:id', async (req, res) => {
  const start = Date.now() / 1000; // Sekunden
  const { id } = req.params;
  const { beacon_MAC, beacon_aktiv, beacon_aktiv_seit, beacon_inaktiv_seit, beacon_hub_id } = req.body;
  if (!beacon_MAC) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'UPDATE beacon SET beacon_MAC = ?, beacon_aktiv = ?, beacon_aktiv_seit = ?, beacon_inaktiv_seit = ?, beacon_hub_id = ?, beacon_hub_ts_beginn = ? WHERE beacon_id = ?',
      [beacon_MAC, beacon_aktiv, beacon_aktiv_seit, beacon_inaktiv_seit, beacon_hub_id, start, id]
    );
    res.status(200).json({ message: 'Beacon updated successfully' });
  } catch (err) {
    console.error("Error updating beacon: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen Beacon löschen
router.delete('/api/beacon/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('DELETE FROM beacon WHERE beacon_id = ?', [id]);
    res.status(200).json({ message: 'Beacon deleted successfully' });
  } catch (err) {
    console.error("Error deleting beacon: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Hinzufügen eines Beacons
router.post('/api/beacon', async (req, res) => {
  const { beacon_MAC, beacon_aktiv, beacon_aktiv_seit } = req.body;
  if (!beacon_MAC) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO beacon (beacon_MAC, beacon_aktiv, beacon_aktiv_seit) VALUES (?, ?, ?)',
      [beacon_MAC, beacon_aktiv, beacon_aktiv_seit]
    );
    res.status(201).json({ message: 'Beacon created successfully' });
  } catch (err) {
    console.error("Error creating beacon: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
