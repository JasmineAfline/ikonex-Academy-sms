const getStudentScores = async (req, res, next) => {
  try {
    res.json({ message: `getStudentScores ${req.params.studentId}` });
  } catch (err) { next(err); }
};
const getClassScores = async (req, res, next) => {
  try {
    res.json({ message: `getClassScores stream:${req.params.streamId} subject:${req.params.subjectId}` });
  } catch (err) { next(err); }
};
const createScore = async (req, res, next) => {
  try {
    res.json({ message: 'createScore - coming soon' });
  } catch (err) { next(err); }
};
const updateScore = async (req, res, next) => {
  try {
    res.json({ message: `updateScore ${req.params.id}` });
  } catch (err) { next(err); }
};
module.exports = { getStudentScores, getClassScores, createScore, updateScore };
