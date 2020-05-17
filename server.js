const express = require('express');
// For environment variables
const dotenv = require('dotenv');
// Colors for some colorful errors
const colors = require('colors');
const morgan = require('morgan');
// Connection for MongoDB Atlas (Cloud)
const connectDB =  require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;
const transactions = require('./routes/transactions');
const stocks = require('./routes/stocks');

app.use(express.json())
app.use('/api/v1/transactions', transactions);
app.use('/api/v1/stocks', stocks);

dotenv.config({path: './config/config.env'})
connectDB();


if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'))
}

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold))