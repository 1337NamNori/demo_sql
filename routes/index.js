var express = require('express');
var router = express.Router();
var cfg = require('../common/config')
const db = require('../common/database')
const passport = require('passport')

/* GET home page. */
router.get('/', checkAuthenticated, function (req, res, next) {
  res.render('index', { title: 'Express', username: req.user.username });
});

router.get('/login',checkNotAuthenticated, (req, res, next) => {
  res.render('login')
})

router.post('/login',checkNotAuthenticated, (req, res, next) => {
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
router.get('/register', checkNotAuthenticated,(req, res, next) => {
  res.render('register')
})

router.post('/register',checkNotAuthenticated, passport.authenticate('local.register', {
  successRedirect: '/login',
  failureRedirect: '/register',
  failureFlash: true
}))

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})



function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

module.exports = router;
