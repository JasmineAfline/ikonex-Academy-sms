const express = require('express');
const router = express.Router();
const controller = require('../controllers/resultsController');

router.get('/student/:studentId', controller.getStudentResult);
router.get('/stream/:streamId', controller.getStreamResults);

module.exports = router;
