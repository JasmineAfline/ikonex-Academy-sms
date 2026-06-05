const pool = require('../db');

const getAllStudents = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT s.*, st.name as stream_name 
      FROM students s
      LEFT JOIN streams st ON s.stream_id = st.id
      ORDER BY s.last_name, s.first_name
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
};

const getStudentById = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT s.*, st.name as stream_name 
      FROM students s
      LEFT JOIN streams st ON s.stream_id = st.id
      WHERE s.id = $1
    `, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

const getStudentsByStream = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT s.*, st.name as stream_name 
      FROM students s
      LEFT JOIN streams st ON s.stream_id = st.id
      WHERE s.stream_id = $1
      ORDER BY s.last_name, s.first_name
    `, [req.params.streamId]);
    res.json(result.rows);
  } catch (err) { next(err); }
};

const createStudent = async (req, res, next) => {
  try {
    const { first_name, last_name, date_of_birth, gender, stream_id, admission_number } = req.body;
    if (!first_name || !last_name || !admission_number) {
      return res.status(400).json({ error: 'first_name, last_name and admission_number are required' });
    }
    const result = await pool.query(
      `INSERT INTO students (first_name, last_name, date_of_birth, gender, stream_id, admission_number)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [first_name, last_name, date_of_birth, gender, stream_id, admission_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
};

const updateStudent = async (req, res, next) => {
  try {
    const { first_name, last_name, date_of_birth, gender, stream_id, admission_number } = req.body;
    const result = await pool.query(
      `UPDATE students SET first_name=$1, last_name=$2, date_of_birth=$3, 
       gender=$4, stream_id=$5, admission_number=$6 WHERE id=$7 RETURNING *`,
      [first_name, last_name, date_of_birth, gender, stream_id, admission_number, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

const deleteStudent = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM students WHERE id=$1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { getAllStudents, getStudentById, getStudentsByStream, createStudent, updateStudent, deleteStudent };