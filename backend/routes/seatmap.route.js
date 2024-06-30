const express = require('express')
const router = express.Router()
const {
  seatOccupancy,
  seatAssign
} = require('@/controllers/seatmap.controller')
const verifyJWTWithRole = require('@/middleware')

router.get('/:showtimeId', verifyJWTWithRole(), seatOccupancy)
router.put('/:showtimeId', verifyJWTWithRole(), seatAssign)
module.exports = router
