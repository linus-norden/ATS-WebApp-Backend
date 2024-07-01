var express = require('express');
var router = express.Router();

const { pool } = require('../index');  // Datenbank-Pool

// Räume mitsamt Bereichsinformationen auslesen (ein View in der Datenbank)
router.get('/api/raum', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM raum_bereich');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Werte eines einzelnen Raums lesen
router.get('/api/raum/:id', async (req, res) => {
const { id } = req.params;
let conn;
try {
  conn = await pool.getConnection();
  const [room] = await conn.query('SELECT * FROM raum where raum_id = ?', [id]);
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  res.json(room);
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
} finally {
  if (conn) conn.release();
}
});


// Alle Räume eines bestimmten Bereiches lesen
router.get('/api/raum_bereich/:id', async (req, res) => {
  const { id } = req.params;
  if (id == 'undefined') return res.status(200).json({});
  let conn;
  try {
    conn = await pool.getConnection();
    const rooms = await conn.query('SELECT * FROM raum_bereich where bereich_id = ?', [id]);
    if (!rooms) {
      return res.status(404).json({ message: 'Room not found' });
    }
    console.log("Räume sind: ", rooms)
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
  });

// Einen neuen Raum hinzufügen
router.post('/api/raum', async (req, res) => {
  const { raum_name, raum_aktiv, raum_aktiv_seit, raum_bereich_id } = req.body;
  if (!raum_name || !raum_bereich_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO raum (raum_name, raum_aktiv, raum_aktiv_seit, raum_bereich_id ) VALUES (?, ?, ?, ?)',
      [raum_name, raum_aktiv, raum_aktiv_seit, raum_bereich_id]
    );
    res.status(201).json({ message: 'Room created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

// Einen bestehenden Raum aktualisieren
router.put('/api/raum/:id', async (req, res) => {
  const { id } = req.params;
  const { raum_id, raum_name, raum_aktiv, raum_aktiv_seit, raum_inaktiv_seit, raum_bereich_id } = req.body;
  console.error(req.body);
  // test ohne fk_hospital
  //if (!are_name || !are_active || !are_fk_hospital) {
  if (!raum_id || !raum_name || !raum_aktiv || !raum_bereich_id) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'update raum set raum_name = ?, raum_aktiv = ?, raum_aktiv_seit = ?, raum_inaktiv_seit = ?, raum_bereich_id = ? where raum_id = ?',
      [raum_name, raum_aktiv, raum_aktiv_seit, raum_inaktiv_seit, raum_bereich_id, raum_id]
    );
    res.status(200).json({ message: 'Raum erfolgreich aktualisiert' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
});

router.delete('/api/raum/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'DELETE FROM raum WHERE raum_id = ?', [id]
      );
      res.status(200).json({ message: 'Room deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      if (conn) conn.release();
    }
});

module.exports = router;
