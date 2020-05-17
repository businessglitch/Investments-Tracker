
const Transaction = require('../models/Transaction')
const QTController  = require('../controllers/questtrade_controller')

// @desc Gets a list of all transactions
// @route GET /api/v1/transactions
// @access Public
exports.getTransactions = async (req,res,next) => {
    try {
        const transactions = await Transaction.find();
        
        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error
        });
    }
}

// @desc Adds a transaction
// @route POST /api/v1/transactions
// @access Public
exports.addTransaction = async (req,res,next) => {
    try {
        const {text,amount} = req.body;
        const content = await QTController.QTW.symbols([text])
        
        if (content.symbols.length > 0) {
            req.body.symbolID =  content.symbols[0].symbolId
            const transaction  = await Transaction.create(req.body)

            return res.status(201).json({
                success: true,
                data: transaction
            });
        } else {

            return res.status(404).json({
                success: false,
                error: 'Symbol not found'
            });
        }
        
    } catch (error) {
        if(error.name = 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);

            return res.status(400).json({
                status: false,
                error: messages
            });
        } else {
            return res.status(500).json({
                status: false,
                error: 'Server Error'
            });
        }
    }
}

// @desc Delets a transaction
// @route DELETE /api/v1/transactions
// @access Public
exports.deleteTransaction = async (req,res,next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
      
        if(!transaction){
            res.status(404).json({
                success:false,
                error: 'No transaction found'
            });
        }

        await transaction.remove();

        return res.status(200).json({
            success:true,
            data: 'Successfully deleted'
        });
    } catch (error) {

        return res.status(500).json({
            success:false,
            error: 'Server Error'
        });
    }
}