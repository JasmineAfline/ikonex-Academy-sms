const pool = require('../db');

const getAllSubjects = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM subjects ORDER BY name');
    res.json(result.rows);
  } catch (err) { next(err); }
};

const getSubjectById = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM subjects WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Subject not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

const createSubject = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) return res.status(400).json({ error: 'name and code are required' });
    const result = await pool.query(
      'INSERT INTO subjects (name, code) VALUES ($1,$2) RETURNING *',
      [name, code]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
};

const updateSubject = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    const result = await pool.query(
      'UPDATE subjects SET name=$1, code=$2 WHERE id=$3 RETURNING *',
      [name, code, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Subject not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

const deleteSubject = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM subjects WHERE id=$1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Subject not found' });
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) { next(err); }
};

const assignSubjectToStream = async (req, res, next) => {
  try {
    const { stream_id, subject_id } = req.body;
    if (!stream_id || !subject_id) return res.status(400).json({ error: 'stream_id and subject_id are required' });
    const result = await pool.query(
      'INSERT INTO stream_subjects (stream_id, subject_id) VALUES ($1,$2) RETURNING *',
      [stream_id, subject_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
};

module.exports = { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject, assignSubjectToStream };