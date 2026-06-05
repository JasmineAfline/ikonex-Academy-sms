const pool = require('../db');

const getStudentResult = async (req, res, next) => {
  try {
    const studentRes = await pool.query(`
      SELECT s.*, st.name as stream_name FROM students s
      LEFT JOIN streams st ON s.stream_id = st.id
      WHERE s.id = $1
    `, [req.params.studentId]);
    if (!studentRes.rows.length) return res.status(404).json({ error: 'Student not found' });

    const scoresRes = await pool.query(`
      SELECT sc.*, su.name as subject_name, su.code,
        g.grade, g.remark
      FROM scores sc
      JOIN subjects su ON sc.subject_id = su.id
      LEFT JOIN grading_scale g ON sc.total_score BETWEEN g.min_score AND g.max_score
      WHERE sc.student_id = $1
      ORDER BY su.name
    `, [req.params.studentId]);

    const scores = scoresRes.rows;
    const total = scores.reduce((sum, s) => sum + parseFloat(s.total_score), 0);
    const average = scores.length ? (total / scores.length).toFixed(2) : 0;

    res.json({
      student: studentRes.rows[0],
      scores,
      summary: {
        total_marks: total.toFixed(2),
        average,
        number_of_subjects: scores.length
      }
    });
  } catch (err) { next(err); }
};

const getStreamResults = async (req, res, next) => {
  try {
    const studentsRes = await pool.query(
      'SELECT * FROM students WHERE stream_id=$1 ORDER BY last_name',
      [req.params.streamId]
    );

    const results = await Promise.all(studentsRes.rows.map(async (student) => {
      const scoresRes = await pool.query(`
        SELECT sc.total_score FROM scores sc WHERE sc.student_id = $1
      `, [student.id]);
      const scores = scoresRes.rows;
      const total = scores.reduce((sum, s) => sum + parseFloat(s.total_score), 0);
      const average = scores.length ? (total / scores.length).toFixed(2) : 0;
      return { ...student, total_marks: total.toFixed(2), average, subjects_count: scores.length };
    }));

    results.sort((a, b) => b.total_marks - a.total_marks);
    results.forEach((s, i) => s.position = i + 1);

    res.json(results);
  } catch (err) { next(err); }
};

module.exports = { getStudentResult, getStreamResults };