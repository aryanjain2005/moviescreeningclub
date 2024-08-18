const Order = require("@/models/food.model")

// exports.getOrders = async (req, res) => {
//     try {
//         const orders = await Order.find();
//         res.status(200).json(orders);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Create a new order
// exports.createOrder = async (req, res) => {
//     try {
//         const { totalPrice, items, showtime } = req.body;

//         // Validate that all necessary fields are present
//         if (!totalPrice || !items || !showtime) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }

//         const newOrder = new Order({
//             totalPrice,
//             items,
//             showtime: {
//                 showtimeId: showtime.showtimeId,
//                 date: showtime.date
//             }
//         });

//         await newOrder.save();
//         res.status(201).json({ message: 'Order created successfully', order: newOrder });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to create order', error });
//     }
// };

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