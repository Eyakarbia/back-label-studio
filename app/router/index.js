const express = require('express');
const router = express.Router();

router.use('/users', require('../modules/user/routes'));
router.use('/files', require('../modules/files/router'));

module.exports = router;
