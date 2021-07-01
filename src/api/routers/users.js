const router = require('express').Router();

const User = require('../../config/db/models/User');

router.get('/', (req,res) => {
    User.find()
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

router.post('/register', (req,res) => {
    const newUser = new User(req.body);

    newUser.save()
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

module.exports = router;