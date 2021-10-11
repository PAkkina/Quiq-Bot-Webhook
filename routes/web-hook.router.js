var express = require('express');
var router = express.Router();
var webHookController = require('../controllers/web-hook.controller')

router.post('/', webHookController.getOrderDetailByOrderNumberAndpostalCode);

module.exports = router;
