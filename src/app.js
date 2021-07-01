(() => {
    const express = require('express');
    const session = require('express-session');
    const MongoStore = require('connect-mongodb-session')(session);

    const app = express();
    const usersMW = require('./api/routers/users');

    const store = new MongoStore({
        uri: process.env.DB_URL,
        collection: 'session'
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(session({
        store,
        secret: process.env.SECRET,
        key: 'connect.sid',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }));

    app.use('/users', usersMW);

    module.exports = app;
})();