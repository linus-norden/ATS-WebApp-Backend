const express = require('express');
const router = express.Router();
const { pool } = require('../index');  // Datenbank-Pool

// MPs aus der View mp_raum_bereich auslesen
router.get('/api/mp', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM mp_raum_bereich');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching MPs: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Werte eines einzelnen MPs lesen
router.get('/api/mp/:id', async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const [mp] = await conn.query('SELECT * FROM mp_raum_bereich WHERE mp_id = ?', [id]);
    if (!mp) {
      return res.status(404).json({ message: 'MP not found' });
    }
    res.json(mp);
  } catch (err) {
    console.error("Error fetching MP by id: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});



// Ein MP aktualisieren
router.put('/api/mp/:id', async (req, res) => {
  const { id } = req.params;
  const { mp_name, mp_SN, mp_aktiv_seit, mp_inaktiv_seit, mp_mp_typ_id, mp_beacon_id, mp_aktiv } = req.body;
  if (!mp_name || !mp_SN || !mp_mp_typ_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'UPDATE mp SET mp_name = ?, mp_SN = ?, mp_aktiv_seit = ?, mp_inaktiv_seit = ?, mp_mp_typ_id = ?, mp_beacon_id = ?, mp_aktiv = ? WHERE mp_id = ?',
      [mp_name, mp_SN, mp_aktiv_seit, mp_inaktiv_seit, mp_mp_typ_id, mp_beacon_id, mp_aktiv, id]
    );
    res.status(200).json({ message: 'MP updated successfully' });
  } catch (err) {
    console.error("Error updating MP: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Ein MP löschen
router.delete('/api/mp/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('DELETE FROM mp WHERE mp_id = ?', [id]);
    res.status(200).json({ message: 'MP deleted successfully' });
  } catch (err) {
    console.error("Error deleting MP: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Hinzufügen eines MPs
router.post('/api/mp', async (req, res) => {
  const { mp_name, mp_SN, mp_aktiv_seit, mp_mp_typ_id, mp_beacon_id, mp_aktiv } = req.body;
  if (!mp_name || !mp_SN || !mp_mp_typ_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO mp (mp_name, mp_SN, mp_aktiv_seit, mp_mp_typ_id, mp_beacon_id, mp_aktiv) VALUES (?, ?, ?, ?, ?, ?)',
      [mp_name, mp_SN, mp_aktiv_seit, mp_mp_typ_id, mp_beacon_id, mp_aktiv]
    );
    res.status(201).json({ message: 'MP created successfully' });
  } catch (err) {
    console.error("Error creating MP: ", err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});


// Alle Beacon IDs auslesen 
router.get('/api/beacons', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT beacon_id FROM beacon');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

router.get('/api/beacon_mp', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT beacon_id FROM beacon_mp');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
