var express = require('express');
var router = express.Router();
const { pool } = require('../index');  // Datenbank-Pool

// Hubs auslesen
router.get('/api/hub', async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM hub_raum_bereich');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      if (conn) conn.release();
    }
});

// Werte eines einzelnen Hubs lesen
router.get('/api/hub/:id', async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const [hub] = await conn.query('SELECT * FROM hub_raum_bereich where hub_id = ?', [id]);
    if (!hub) {
      return res.status(404).json({ message: 'Hub not found' });
    }
    res.json(hub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen Hub aktualisieren
router.put('/api/hub/:id', async (req, res) => {
  const start = Date.now()/1000; //Sekunden
  const { id } = req.params;
  const { hub_MAC, hub_id, hub_aktiv, hub_aktiv_seit, hub_inaktiv_seit, raum_id } = req.body;
  console.error(req.body);
  if (!hub_MAC | ! hub_id) {
      return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    // Die Historientabelle benötigt einen Änderungszeitpunkt. Wenn also ein Hub den Raum wechselt, ist dieser mitzugeben.
    await conn.query(
      'UPDATE hub SET hub_MAC = ?, hub_aktiv = ?, hub_aktiv_seit = ?, hub_inaktiv_seit = ?, hub_raum_id = ?, hub_raum_ts = ?  WHERE hub_id = ?',
      [hub_MAC, hub_aktiv, hub_aktiv_seit, hub_inaktiv_seit, raum_id, start, hub_id]
    );
    res.status(200).json({ message: 'Area updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen Hub löschen
router.delete('/api/hub/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('DELETE FROM hub WHERE hub_id = ?', [id]);
    res.status(200).json({ message: 'Hub deleted successfully' });
  } catch (err) {
    console.error("Error deleting Hub: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Hinzufügen eines Hubs
router.post('/api/hub', async (req, res) => {
  const { hub_MAC, hub_aktiv, hub_aktiv_seit, raum_id } = req.body;
    if (!hub_MAC ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO hub (hub_MAC, hub_aktiv, hub_aktiv_seit, hub_raum_id ) VALUES (?, ?, ?, ?)',
      [hub_MAC, hub_aktiv, hub_aktiv_seit, raum_id]
    );
    res.status(201).json({ message: 'Hub created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
