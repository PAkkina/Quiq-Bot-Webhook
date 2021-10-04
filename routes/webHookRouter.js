var express = require('express');
var router = express.Router();
var webHookController = require('../controllers/webHookController')

router.post('/user-orders', webHookController.getUserOrders);
router.post('/orders-by-number-and-zipCode', webHookController.getOrderDetailByOrderNumberAndpostalCode);

module.exports = router;