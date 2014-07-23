var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.json ( 200, "{ links: { } }");
});

module.exports = router;
