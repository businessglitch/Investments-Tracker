const express = require('express');
const router = express.Router();
const {getMarketQuote} = require('../controllers/stocks-controller');

router
    .route('/')
    .post(getMarketQuote)

module.exports = router;