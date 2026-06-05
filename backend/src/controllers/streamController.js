const pool = require('../db');

const getAllStreams = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM streams ORDER BY name');
    res.json(result.rows);
  } catch (err) { next(err); }
};

const getStreamById = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM streams WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Stream not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

const createStream = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Stream name is required' });
    const result = await pool.query(
      'INSERT INTO streams (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
};

const updateStream = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      'UPDATE streams SET name=$1, description=$2 WHERE id=$3 RETURNING *',
      [name, description, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Stream not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

const deleteStream = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM streams WHERE id=$1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Stream not found' });
    res.json({ message: 'Stream deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { getAllStreams, getStreamById, createStream, updateStream, deleteStream };