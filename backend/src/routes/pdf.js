const express = require('express');
const router = express.Router();
const controller = require('../controllers/pdfController');

router.get('/student/:studentId', controller.generateStudentReportCard);
router.get('/class/:streamId', controller.generateClassReport);

module.exports = router;