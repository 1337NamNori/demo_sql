const LocalStrategy = require("passport-local").Strategy;
const userUtil = require('./userUtil')
const cfg = require("./config");
const db = require('./database')


module.exports = function (passport) {
    // Local Login
    passport.use(`local.login`,
      new LocalStrategy(
        { usernameField: "username" , passwordField: "password"},
        (username, password, done) => {
          valid = userUtil.validateNotNull(username)
          valid = valid && userUtil.validateNotNull(password)
          if(valid){
            // Match user
            db.query(
              `select * from user where username = ${db.escape(username)} and password = ${db.escape(password)}`
            ).then(rows => {
              if (rows.length <= 0) {
                return done(null, false, {message:"Tài khoản / mật khẩu không chính xác."});
              }
              let user = rows[0];
              
              return done(null, user);
            });
          }
          else{
            return done(null, false, {message:"Mời điền đầy đủ thông tin."});
          }
        }
      )
    );
  
    passport.use('local.register',
      new LocalStrategy(
        {
          usernameField: "username",
          passwordField: "password",
          passReqToCallback: true
        },
        (req, username, password, done) => {
          process.nextTick(async function () {
            // Match user
            valid = await userUtil.validateNewUsername(username)
            valid = valid & await userUtil.validatePassword(password)
            if(valid){
              let name = req.body.name
              let query = `insert into user set ` + 
                          `username = ${db.escape(username)}, ` + 
                          `password= sha2(${db.escape(password)},256), ` + 
                          `name = ${db.escape(name)};`
              ret = await db.query(query)
              let newUser = new Object()
              newUser.id = ret.insertId
              return done(null, newUser)
            }
            else{
              return done(null, false, req.flash('Không thể đăng kí với thông tin này.'));
            }
          })
      })
    );
  
    // Remember Me 
  //   passport.use(
  //     new RememberMeStrategy(
  //       function (token, done) {
  //         Token.consume(token, function (err, user) {
  //           if (err) {
  //             return done(err);
  //           }
  //           if (!user) {
  //             return done(null, false);
  //           }
  //           return done(null, user);
  //         });
  //       },
  //       function (user, done) {
  //         var token = utils.generateToken(64);
  //         Token.save(token, { userId: user.id }, function (err) {
  //           if (err) {
  //             return done(err);
  //           }
  //           return done(null, token);
  //         });
  //       }
  //     )
  //   );
  
  
  
    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });
  
    passport.deserializeUser(function (id, done) {
      db.query(`select * from user where id = ${id}`).then(
        (rows) => {
          done(null,rows[0]);
        }
      )
    });
  };
  