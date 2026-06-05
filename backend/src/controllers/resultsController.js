const getStudentResult = async (req, res, next) => {
  try {
    res.json({ message: `getStudentResult ${req.params.studentId}` });
  } catch (err) { next(err); }
};
const getStreamResults = async (req, res, next) => {
  try {
    res.json({ message: `getStreamResults ${req.params.streamId}` });
  } catch (err) { next(err); }
};
module.exports = { getStudentResult, getStreamResults };
