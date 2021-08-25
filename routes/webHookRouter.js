var express = require('express');
var router = express.Router();
var webHookController = require('../controllers/webHookController')

router.post('/', webHookController.getOrderDetailByOrderNumberAndpostalCode);

module.exports = router;
