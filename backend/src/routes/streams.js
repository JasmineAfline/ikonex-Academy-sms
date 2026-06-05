const express = require('express');
const router = express.Router();
const controller = require('../controllers/streamController');

router.get('/', controller.getAllStreams);
router.get('/:id', controller.getStreamById);
router.post('/', controller.createStream);
router.put('/:id', controller.updateStream);
router.delete('/:id', controller.deleteStream);

module.exports = router;
