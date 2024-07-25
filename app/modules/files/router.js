const express = require('express');
const router = express.Router();
const fileController = require('./filecontroller');

router.post('/upload', fileController.uploadFile);
router.get('/data', fileController.getFileData);

module.exports = router;
