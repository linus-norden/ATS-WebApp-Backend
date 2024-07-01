var express = require('express');
var router = express.Router();
const { pool } = require('../index');  // Datenbank-Pool

// Alle MP-Typen auslesen
router.get('/api/mp_typ', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM mp_typ');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen einzelnen MP-Typ auslesen
router.get('/api/mp_typ/:id', async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const [mpTyp] = await conn.query('SELECT * FROM mp_typ WHERE mp_typ_id = ?', [id]);
    if (!mpTyp) {
      return res.status(404).json({ message: 'MP Typ not found' });
    }
    res.json(mpTyp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen MP-Typ hinzufügen
router.post('/api/mp_typ', async (req, res) => {
  const { mp_typ_name, mp_typ_aktiv, mp_typ_master, mp_typ_verbinder, mp_typ_endpunkt } = req.body;
  if (!mp_typ_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO mp_typ (mp_typ_name, mp_typ_aktiv) VALUES (?, ?)',
      [mp_typ_name, mp_typ_aktiv, mp_typ_master, mp_typ_verbinder, mp_typ_endpunkt]
    );
    res.status(201).json({ message: 'MP Typ created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen MP-Typ aktualisieren
router.put('/api/mp_typ/:id', async (req, res) => {
  const { id } = req.params;
  const { mp_typ_name, mp_typ_aktiv} = req.body;
  if (!mp_typ_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'UPDATE mp_typ SET mp_typ_name = ?, mp_typ_aktiv = ?',
      [mp_typ_name, mp_typ_aktiv, mp_typ_master, mp_typ_verbinder, mp_typ_endpunkt, id]
    );
    res.status(200).json({ message: 'MP Typ updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen MP-Typ löschen
router.delete('/api/mp_typ/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('DELETE FROM mp_typ WHERE mp_typ_id = ?', [id]);
    res.status(200).json({ message: 'MP Typ deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
