const QTController  = require('../controllers/questtrade_controller')

// @desc Gets the current marjet value for the specified stock
// @route GET /api/v1/stocks
// @input ids of stocks
// @access Public
exports.getMarketQuote = async (req, res, next) => {
    try {
        const content = await QTController.QTW.market_quotes(req.body)

        return res.status(200).json({
            success: true,
            count: content.quotes.length,
            data: content.quotes
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error
        });
    }
}

// @desc Gets a list of all stocks the user currently holds
// @route GET /api/v1/stocks
// @input names of stock
// @access Public
exports.getStocks = async (req, res, next) => {
    try {
        const content = await QTController.QTW.symbols(req.body)

        return res.status(200).json({
            success: true,
            count: content.symbols.length,
            data: content.symbols
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error
        });
    }
}