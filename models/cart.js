const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    prices: {
        type: Array,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Cart', cartSchema, 'cart');
