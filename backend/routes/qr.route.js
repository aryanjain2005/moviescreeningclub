const express = require('express')
const { getQRs, check } = require('@/controllers/QR.controller')
const verifyJWTWithRole = require('@/middleware')

const router = express.Router()

router.post('/check', verifyJWTWithRole('ticketvolunteer'), check)
router.get('/', verifyJWTWithRole(), getQRs)
module.exports = router
