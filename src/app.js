(() => {
    const express = require('express');
    const session = require('express-session');
    const MongoStore = require('connect-mongo');
    const passport = require('passport');

    const app = express();
    const usersRouter = require('./api/routers/users');

    const store = MongoStore.create({
        mongoUrl: process.env.DB_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        crypto: {
            secret: process.env.SECRET
        }
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
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/users', usersRouter);

    module.exports = app;
})();