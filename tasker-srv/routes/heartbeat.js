var express = require('express');
var router = express.Router();

/* GET heartbeat. */
router.get('/', function(req, res) {
  res.json (200, 'OK');	
});

module.exports = router;
