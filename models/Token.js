const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    value: {
        type: String,
        trim: true,
        required: [true, 'Please enter a token value']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RFToken', TokenSchema,  'tokens')