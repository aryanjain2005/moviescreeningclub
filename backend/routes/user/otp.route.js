const express = require('express')
const { userOTP, sendOTPforgot } = require('@/controllers/user/otp.controller')
const router = express.Router()
router.post('/user', userOTP)
router.post('/forgot', sendOTPforgot)
module.exports = router
