 const passport = require('passport');
 const passportLocal = require('passport-local').Strategy;
 const {User} = require('./database');
 const validPassword = require('../Utils/passwordVaild');


 const customFields = {
    usernamefield: 'email',
    passwordfield: 'password'
 };

 const verifyCallBack = (email, password, done) => {
    User.findOne({email: email}).then(user => {
        if (!user) {return done(null, false, {message: "user doesn't exist"})}
        const isValid = validPassword(password, user.hash, user.salt)

        if(isValid) {return done(null, user)}
        else {return done(null, false)}
    })
    .catch(err => {done(err)})
 };

 const strategy = new passportLocal(customFields, verifyCallBack);

 passport.use(strategy);

 passport.serializeUser((user, done) => {
    done(null ,user.id)
 });

 passport.deserializeUser((userId, done) => {
    User.findById(userId).then(user => {
        done(null, user)
    })
    .catch(err => done(err))
 });