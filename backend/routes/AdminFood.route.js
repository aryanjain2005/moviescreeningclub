
const express = require('express');
const router = express.Router();
const foodControllerAdmin = require('@/controllers/AdminFoodCorner');

router.get('/food-items', foodControllerAdmin.getFoodItems);
router.post('/food-items', foodControllerAdmin.createFoodItem);
router.put('/food-items/:id',foodControllerAdmin.updateFoodItem);
router.delete('/food-items/:id',foodControllerAdmin.deleteFoodItem)

module.exports = router;
