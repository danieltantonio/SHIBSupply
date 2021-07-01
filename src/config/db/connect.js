(() => {
    const mongoose = require('mongoose');
    const url = process.env.DB_URL;

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log(`~~ Server connected to DB 💽 ~~`)
    })
    .catch(err => {
        console.log(err);
    });
})();