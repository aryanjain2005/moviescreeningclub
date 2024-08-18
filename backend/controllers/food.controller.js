const Order = require("@/models/food.model")

exports.createOrder = async (req, res) => {
    try {
        const { movie, items, totalPrice, email, otp } = req.body;

        const order = new Order({
            movie,
            items,
            totalPrice,
            email,
            otp
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('movie.movieId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error });
    }
};

// Verify email and OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const order = await Order.findOne({ email, otp });

        if (order) {
            res.status(200).json({ message: 'OTP verified successfully!', orderId: order._id });
        } else {
            res.status(400).json({ message: 'Invalid email or OTP.' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP.' });
    }
};