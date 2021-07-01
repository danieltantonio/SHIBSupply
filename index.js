(() => {
    require('dotenv').config();
    require('./src/config/db/connect');
    const app = require('./src/app');
    const PORT = parseInt(process.env.PORT) || 3000;

    app.listen(PORT, () => console.log(`** Server started on port: ${PORT}... **`));
})();