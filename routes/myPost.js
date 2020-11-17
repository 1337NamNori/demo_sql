var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('../views/myPost/myPost.ejs');
});

router.get('/post', function(req, res, next) {
  res.render('../views/myPost/post.ejs');
});

module.exports = router;
