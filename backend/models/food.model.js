const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    movie: {
        movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
        title: { type: String, required: true },
        showtimeId: { type: mongoose.Schema.Types.ObjectId, required: true },
        showtimeDate: { type: Date, required: true }
    },
    items: [
        {
            foodName: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            vendor: { type: String, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
