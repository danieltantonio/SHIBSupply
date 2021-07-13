(() => {
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const bcrypt = require('bcryptjs');

    const User = require('../db/models/User');

    const strategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        User.findOne({email}).then(user => {
            if (!user) return done(null, false, {message: 'Invalid credentials'});
            
            const isValid = bcrypt.compareSync(password, user.password);

            if (! isValid) {
                return done(null, false, {message: 'Invalid credentials'});
            } else {
                return done(null, user);
            }
        }).catch(err => {
            return done(err);
        })
    });

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((userID, done) => {
        User.findById(userID).then(user => {
            let isVerified = user.tfaSecret && user.emailVerified ? true : false;
            const cleanUser = {
                _id: user.id,
                email: user.email,
                verified: isVerified
            }

            done(null, cleanUser);
        }).catch(err => {
            done(err);
        });
    });

    passport.use(strategy);
})()
