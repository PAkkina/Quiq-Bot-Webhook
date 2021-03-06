var express = require('express');
var router = express.Router();
const path = require('path')
var webHookController = require('../controllers/web-hook.controller')

/* GET home page. */
router.get('/', function (req, res, next) {
  const DIST_DIR = __dirname;
  let HTML_FILE;

  if (process.env.NODE_ENV === 'development') {
    HTML_FILE = path.join(DIST_DIR, 'index.html')
  }
  
  else {
    HTML_FILE = path.join(DIST_DIR, '../public/index.html')
  }

  res.sendFile(HTML_FILE);
});

//web hook route
router.post('/webhook', webHookController.getOrderDetailByOrderNumberAndpostalCode);


module.exports = router;
