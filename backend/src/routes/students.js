const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');

router.get('/', controller.getAllStudents);
router.get('/:id', controller.getStudentById);
router.get('/stream/:streamId', controller.getStudentsByStream);
router.post('/', controller.createStudent);
router.put('/:id', controller.updateStudent);
router.delete('/:id', controller.deleteStudent);

module.exports = router;
