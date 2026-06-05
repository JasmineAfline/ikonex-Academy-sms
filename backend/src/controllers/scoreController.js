const pool = require('../db');

const getStudentScores = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT sc.*, su.name as subject_name, su.code as subject_code,
        g.grade, g.remark
      FROM scores sc
      JOIN subjects su ON sc.subject_id = su.id
      LEFT JOIN grading_scale g ON sc.total_score BETWEEN g.min_score AND g.max_score
      WHERE sc.student_id = $1
      ORDER BY su.name
    `, [req.params.studentId]);
    res.json(result.rows);
  } catch (err) { next(err); }
};

const getClassScores = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT sc.*, st.first_name, st.last_name, st.admission_number,
        g.grade, g.remark
      FROM scores sc
      JOIN students st ON sc.student_id = st.id
      LEFT JOIN grading_scale g ON sc.total_score BETWEEN g.min_score AND g.max_score
      WHERE st.stream_id = $1 AND sc.subject_id = $2
      ORDER BY sc.total_score DESC
    `, [req.params.streamId, req.params.subjectId]);
    res.json(result.rows);
  } catch (err) { next(err); }
};

const createScore = async (req, res, next) => {
  try {
    const { student_id, subject_id, exam_score, ca_score, term, academic_year } = req.body;
    if (!student_id || !subject_id) return res.status(400).json({ error: 'student_id and subject_id are required' });
    if (exam_score < 0 || exam_score > 100 || ca_score < 0 || ca_score > 100) {
      return res.status(400).json({ error: 'Scores must be between 0 and 100' });
    }
    const result = await pool.query(
      `INSERT INTO scores (student_id, subject_id, exam_score, ca_score, term, academic_year)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [student_id, subject_id, exam_score || 0, ca_score || 0, term || 'Term 1', academic_year || '2025']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Score already exists for this student and subject' });
    next(err);
  }
};

const updateScore = async (req, res, next) => {
  try {
    const { exam_score, ca_score } = req.body;
    if (exam_score < 0 || exam_score > 100 || ca_score < 0 || ca_score > 100) {
      return res.status(400).json({ error: 'Scores must be between 0 and 100' });
    }
    const result = await pool.query(
      'UPDATE scores SET exam_score=$1, ca_score=$2 WHERE id=$3 RETURNING *',
      [exam_score, ca_score, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Score not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

module.exports = { getStudentScores, getClassScores, createScore, updateScore };