const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    items: [
        {
            product: {
                name: String,
                price: Number,
                discount: Number
            },
            quantity: Number
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    paymentId: String,
    orderId: String,

    status: {
        type: String,
        default: "cod"
    }

}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);