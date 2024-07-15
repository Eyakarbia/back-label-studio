const express = require('express');
let router = express.Router();

router.use('/user', require('../modules/user/routes'));

module.exports = router;
