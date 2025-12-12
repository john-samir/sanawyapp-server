require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const errorMiddleware = require('./middlewares/errorMiddleware');
const routes = require('./routes');


const app = express();
app.use(cors({ origin: (process.env.CORS_ORIGINS || '').split(',') }));
app.use(express.json());


//Initialize Models
require('./models');

// Mount Routes
app.use('/api', routes);

// global error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});