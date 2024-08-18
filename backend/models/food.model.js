// const mongoose = require("mongoose");

// const ShowtimeSchema = new mongoose.Schema({
//     showtimeId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'Movie'
//     },
//     date: {
//         type: Date,
//         required: true
//     }
// });

// const ItemSchema = new mongoose.Schema({
//     foodName: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     vendor:{
//         type:String,
//         required:true
//     },
//     quantity:{
//         type:Number,
//         required:true
//     }
// });

// const OrderSchema = new mongoose.Schema({
//     showtime: {
//         type: ShowtimeSchema, // Stores the showtime for which the food is ordered
//         required: true
//     },
//     totalPrice:{
//         type:Number,
//         required:true
//     },
//     items: {
//         type: [ItemSchema], 
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }

// })

// module.exports = mongoose.model('Order', OrderSchema);

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
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
