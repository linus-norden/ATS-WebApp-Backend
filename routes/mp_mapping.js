var express = require('express');
var router = express.Router();
const { pool } = require('../index');  // Datenbank-Pool

// Alle MP-Mappings auslesen
router.get('/api/mp_mapping', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT mp_mapping_id,
             mp_typ_name_1,
             mp_typ_name_2,
             mp_typ_id_1,
             mp_typ_id_2
      FROM mapping_typ_namen`);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Ein einzelnes MP-Mapping auslesen
router.get('/api/mp_mapping/:id', async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const [mapping] = await conn.query('SELECT * FROM mapping_typ_namen WHERE mp_mapping_id = ?', [id]);
    if (!mapping) {
      return res.status(404).json({ message: 'Mapping not found' });
    }
    res.json(mapping);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Ein MP-Mapping hinzufügen
router.post('/api/mp_mapping', async (req, res) => {
  const { mp_typ_id_1, mp_typ_id_2 } = req.body;
  if (!mp_typ_id_1 || !mp_typ_id_2) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('INSERT INTO mp_mapping (mp_mapping_mp_typ_id_1, mp_mapping_mp_typ_id_2) VALUES (?, ?)', [mp_typ_id_1, mp_typ_id_2]);
    res.status(201).json({ message: 'Mapping created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Ein MP-Mapping aktualisieren
router.put('/api/mp_mapping/:id', async (req, res) => {
  const { id } = req.params;
  const { mp_typ_id_1, mp_typ_id_2 } = req.body;
  if (!mp_typ_id_1 || !mp_typ_id_2) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('UPDATE mp_mapping SET mp_mapping_mp_typ_id_1 = ?, mp_mapping_mp_typ_id_2 = ? WHERE mp_mapping_id = ?', [mp_typ_id_1, mp_typ_id_2, id]);
    res.status(200).json({ message: 'Mapping updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Ein MP-Mapping löschen
router.delete('/api/mp_mapping/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('DELETE FROM mp_mapping WHERE mp_mapping_id = ?', [id]);
    res.status(200).json({ message: 'Mapping deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
