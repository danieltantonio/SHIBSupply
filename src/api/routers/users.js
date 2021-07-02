(() => {
    const router = require('express').Router();
    const passport = require('passport');

    const User = require('../../config/db/models/User');

    router.get('/', (req, res) => {
        User.find().then(data => {
            res.status(200).send(data);
        }).catch(err => {
            res.status(500).send(err);
        });
    });

    router.post('/register', (req, res) => {
        const newUser = new User(req.body);

        newUser.save().then(data => {
            res.status(200).send(data);
        }).catch(err => {
            res.status(500).send(err);
        });
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
