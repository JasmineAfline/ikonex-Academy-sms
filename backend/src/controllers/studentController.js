const getAllStudents = async (req, res, next) => {
  try {
    res.json({ message: 'getAllStudents - coming soon' });
  } catch (err) { next(err); }
};
const getStudentById = async (req, res, next) => {
  try {
    res.json({ message: `getStudentById ${req.params.id}` });
  } catch (err) { next(err); }
};
const getStudentsByStream = async (req, res, next) => {
  try {
    res.json({ message: `getStudentsByStream ${req.params.streamId}` });
  } catch (err) { next(err); }
};
const createStudent = async (req, res, next) => {
  try {
    res.json({ message: 'createStudent - coming soon' });
  } catch (err) { next(err); }
};
const updateStudent = async (req, res, next) => {
  try {
    res.json({ message: `updateStudent ${req.params.id}` });
  } catch (err) { next(err); }
};
const deleteStudent = async (req, res, next) => {
  try {
    res.json({ message: `deleteStudent ${req.params.id}` });
  } catch (err) { next(err); }
};
module.exports = { getAllStudents, getStudentById, getStudentsByStream, createStudent, updateStudent, deleteStudent };
