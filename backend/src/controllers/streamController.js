const getAllStreams = async (req, res, next) => {
  try {
    res.json({ message: 'getAllStreams - coming soon' });
  } catch (err) { next(err); }
};
const getStreamById = async (req, res, next) => {
  try {
    res.json({ message: `getStreamById ${req.params.id}` });
  } catch (err) { next(err); }
};
const createStream = async (req, res, next) => {
  try {
    res.json({ message: 'createStream - coming soon' });
  } catch (err) { next(err); }
};
const updateStream = async (req, res, next) => {
  try {
    res.json({ message: `updateStream ${req.params.id}` });
  } catch (err) { next(err); }
};
const deleteStream = async (req, res, next) => {
  try {
    res.json({ message: `deleteStream ${req.params.id}` });
  } catch (err) { next(err); }
};
module.exports = { getAllStreams, getStreamById, createStream, updateStream, deleteStream };
