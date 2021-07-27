(() => {
    const express = require('express');
    const session = require('express-session');
    const MongoStore = require('connect-mongo');
    const passport = require('passport');
    const cors = require('cors');

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

    app.use(cors({
        origin: 'http://localhost:1234',
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
        credentials: true
    }));
    app.use(session({
        store,
        secret: process.env.SECRET,
        key: 'shibsup.sid',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60
        }
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req,res,next) => {
        console.log(req.session);
        console.log(req.user);
        next();
    });
    
    app.use('/users', usersRouter);

    module.exports = app;
})();