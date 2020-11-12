var express = require('express');
var router = express.Router();
var cfg = require('../common/config')
const db = require('../common/database')
const passport = require('passport')

/* GET home page. */
router.get('/', checkAuthenticated, function (req, res, next) {
  res.render('index', { title: 'Express', username: req.user.username });
});

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local.login', function (err, user, info) {
    if (!user) {
      console.log('Failed!');
    } else {
      req.login(user, function (err) {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/');
      });
    }
  })(req, res, next);
}
);
router.get('/register', (req, res, next) => {
  res.render('register')
})

router.post('/register', passport.authenticate('local.register',{
  successRedirect: '/login',
  failureRedirect: '/register',
  failureFlash:true
}))


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')


}

module.exports = router;
