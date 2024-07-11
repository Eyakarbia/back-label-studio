const express = require('express');
const controller = require('./controller');

let router = express.Router();

router.get('/get', controller.get);
router.post('/create', controller.create);

module.exports = router;
