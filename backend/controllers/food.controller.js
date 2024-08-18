const Order = require("@/models/food.model")

exports.createOrder = async (req, res) => {
    try {
        const { movie, items, totalPrice } = req.body;

        const order = new Order({
            movie,
            items,
            totalPrice
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