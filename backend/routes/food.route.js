const express = require('express')
const router = express.Router()
const orderController = require('@/controllers/food.controller');

// router.get('/orders', orderController.getOrders);
// router.post('/orders', orderController.createOrder);
router.post('/create', orderController.createOrder);
router.get('/orders', orderController.getOrders);
router.get('/verify-otp',orderController.verifyOtp);

module.exports = router;
