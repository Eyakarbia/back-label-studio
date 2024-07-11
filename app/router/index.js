const express = require('express');
let router = express.Router();

router.use('/user', require('../modules/user/routes'));

//router.use('/product', require('../modules/product/routes'));

module.exports = router;
