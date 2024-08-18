const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    poster:{
        type: String,
        required:true
    }
});

module.exports = mongoose.model('FoodItem', FoodItemSchema);
