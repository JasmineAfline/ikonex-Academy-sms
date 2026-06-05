const express = require('express');
const router = express.Router();
const controller = require('../controllers/scoreController');

router.get('/student/:studentId', controller.getStudentScores);
router.get('/stream/:streamId/subject/:subjectId', controller.getClassScores);
router.post('/', controller.createScore);
router.put('/:id', controller.updateScore);

module.exports = router;
