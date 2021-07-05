(() => {
    const router = require('express').Router();
    const passport = require('passport');
    const speakeasy = require('speakeasy');
    const bcrypt = require('bcryptjs');
    const qrcode = require('qrcode-terminal'); // temporary :)

    const User = require('../../config/db/models/User');
    const isAuth = require('../middleware/auth-mw');

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
        const tmpOTPAuth = `otpauth://totp/SHIB Supply(${userData.username})?secret=${tmpSecret}`;

        const user = {
            ... userData,
            tmpSecret,
            tmpOTPAuth
        };

        const newUser = new User(user);

        newUser.save().then(data => {
            qrcode.generate(tmpOTPAuth, url => {
                console.log(url);
            }); // temporary

            res.status(201).json(data);
        }).catch(err => {
            res.status(500).send(err);
        });
    });

    // Used for after a user is registered and after /login.
    router.post('/verify', async (req, res) => {
        const userData = req.body;
        try {
            // find user then authenticate with 2FA
            const user = await User.findOne({ email: userData.email });

            if(!user) return res.status(400).json({ msg: 'Invalid credentials' });
            if(!bcrypt.compareSync(userData.password, user.password)) {
                return res.status(400).send({ msg: 'Invalid credentials' });
            }

            // 2FA (BASED) - Matt
            // If they haven't verified their temporary secret after register.
            if(user.tmpSecret) {
                const { token } = userData;
                const { tmpSecret:secret } = user;

                const verified = speakeasy.totp.verify({
                    token,
                    secret,
                    encoding: 'base32'
                });

                if(!verified) {
                    // TODO: Make new endpoint to request new secret.
                    return res.status(400).json({ msg: 'Invalid credentials' });
                } else {
                    await User.findByIdAndUpdate(user.id, {
                        tfaSecret: user.tmpSecret,
                        tmpSecret: null,
                        tmpOTPAuth: null
                    });

                    req.login(user, err => {
                        if(err) {
                            console.log(err);
                            return res.status(500).send('Server error');
                        }

                        res.status(202).json({ msg: 'User is now verified' });
                    });
                }
            } else {
                // Should only be accessible if they already verified the first time.
                const { tfaSecret:secret } = user;
                const { token } = userData;
                
                const verified = speakeasy.totp.verify({
                    token,
                    secret,
                    encoding: 'base32'
                });

                if(!verified) {
                    return res.status(400).json({ msg: 'Invalid credentials' });
                } else {
                   req.login(user, err => {
                       if(err) return res.status(500).json({ msg: 'Server error' });

                       return res.status(202).json(user);
                   });
                }
            }
        } catch(err) {
            console.log(err);
            res.status(500).send({ msg: 'Server error' });
        }
    });

    router.post('/login', (req,res) => {
        const userInfo = req.body;
        User.findBy({ email: userInfo.email })
        .then(user => {
            if(!user) return res.status(400).json({ msg: 'Invalid credentials' });

            if(!bcrypt.compareSync(userInfo.password, user.password)) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            } else {
                return res.status(201).json({ msg: 'User accepted' });
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
    });

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
