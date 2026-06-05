const getAllSubjects = async (req, res, next) => {
  try {
    res.json({ message: 'getAllSubjects - coming soon' });
  } catch (err) { next(err); }
};
const getSubjectById = async (req, res, next) => {
  try {
    res.json({ message: `getSubjectById ${req.params.id}` });
  } catch (err) { next(err); }
};
const createSubject = async (req, res, next) => {
  try {
    res.json({ message: 'createSubject - coming soon' });
  } catch (err) { next(err); }
};
const updateSubject = async (req, res, next) => {
  try {
    res.json({ message: `updateSubject ${req.params.id}` });
  } catch (err) { next(err); }
};
const deleteSubject = async (req, res, next) => {
  try {
    res.json({ message: `deleteSubject ${req.params.id}` });
  } catch (err) { next(err); }
};
const assignSubjectToStream = async (req, res, next) => {
  try {
    res.json({ message: 'assignSubjectToStream - coming soon' });
  } catch (err) { next(err); }
};
module.exports = { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject, assignSubjectToStream };
