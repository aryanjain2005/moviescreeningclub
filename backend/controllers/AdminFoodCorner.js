const FoodItem = require('@/models/AdminFoodCorner.model');

// Get all food items
exports.getFoodItems = async (req, res) => {
    try {
        const foodItems = await FoodItem.find();
        res.status(200).json(foodItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new food item
exports.createFoodItem = async (req, res) => {
    const {foodName,vendor,price,description,poster} = req.body;
    const foodItem = new FoodItem({
        foodName,
        vendor,
        price,
        description,
        poster
    });

    try {
        const newFoodItem = await foodItem.save();
        res.status(201).json(newFoodItem);
    } catch (err) {
        console.error('Error saving food item:', err);
        res.status(400).json({ message: err.message });
    }
};

// Update an existing food item
exports.updateFoodItem = async (req, res) => {
    const { id } = req.params;
    const { foodName, vendor, price, description, poster } = req.body;

    try {
        const updatedFoodItem = await FoodItem.findByIdAndUpdate(id, {
            foodName,
            vendor,
            price,
            description,
            poster
        }, { new: true });

        if (!updatedFoodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.json(updatedFoodItem);
    } catch (error) {
        res.status(400).json({ message: 'Error updating food item', error });
    }
};

// Delete a food item
exports.deleteFoodItem = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFoodItem = await FoodItem.findByIdAndDelete(id);

        if (!deletedFoodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.json({ message: 'Food item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting food item', error });
    }
};
