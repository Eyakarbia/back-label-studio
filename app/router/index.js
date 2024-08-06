const express = require('express');
const router = express.Router();

router.use('/users', require('../modules/user/routes'));
router.use('/files', require('../modules/files/router'));
router.use('/patient',require('../modules/patient/router'))
module.exports = router;
