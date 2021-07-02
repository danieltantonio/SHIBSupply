(() => {
    const router = require('express').Router();
    const passport = require('passport');
    const speakeasy = require('speakeasy');
    const qrcode = require('qrcode-terminal'); // temporary :)

    const User = require('../../config/db/models/User');

    router.get('/', (req, res) => {
        User.find().then(data => {
            res.status(200).send(data);
        }).catch(err => {
            res.status(500).send(err);
        });
    });

    router.post('/register', (req, res) => {
        const userData = req.body;
        const genSecret = speakeasy.generateSecret(); // Validate token against tmpSecret, if fails will generate a new secret, if successul then the tmpSecret is set as the user's secret.

        const tmpSecret = genSecret.base32;
        const tmpOTPAuth = `otpauth://totp/SHIBSupply?secret=${tmpSecret}`;

        const user = {
            ... userData,
            tmpSecret,
            tmpOTPAuth
        };

        const newUser = new User(user);

        newUser.save().then(data => {
            qrcode.generate(tmpOTPAuth, url => {
                console.log(url);
            });

            res.status(200).send(data);
        }).catch(err => {
            res.status(500).send(err);
        });
    });

    // Used for after a user is registered.
    router.post('/verify', (req, res) => {
        res.send('nothing yet');
    });

    router.post('/login', passport.authenticate('local', {
        successRedirect: 'protected',
        failureRedirect: 'failed'
    }));

    router.get('/protected', (req, res) => {
        if (!req.isAuthenticated()) {
            res.send('WHO IS YOU!?');
        } else {
            res.send('Welcome to the club :)');
        }
    });

    router.get('/failed', (req, res) => {
        res.status(401).send('Mario: No');
    });

    module.exports = router;
})();
