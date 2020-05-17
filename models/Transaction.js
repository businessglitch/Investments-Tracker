const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: [true, 'Please enter Stock\'s Symbol']
    },
    amount: {
        type: Number,
        required: [true, 'Please enter total transaction amount']
    },
    price: {
        type: Number,
        required: [true, 'Please enter transaction price']
    },
    quantity: {
        type: Number,
        required: [true, 'Please enter shares quantity']
    },
    symbolID: {
        type: Number,
        required: [true, 'Quest trade ID of stock symbol']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema)