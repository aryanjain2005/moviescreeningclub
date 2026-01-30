const express = require('express')
const router = express.Router()
const {
  fetchUsers,
  updateUserType,
  userType,
  userMembershipData,
  getUserDetails,
  updateUserDetails,
  updateMembership,
  updateQRCode,
  deleteMembership,
  deleteQRCode
} = require('@/controllers/user/user.controller')
const { verifyJWTWithRole } = require('@/middleware')

router.get('/fetchusers', verifyJWTWithRole('admin'), fetchUsers)
router.post('/updateUserType', verifyJWTWithRole('admin'), updateUserType)
router.get('/details/:email', verifyJWTWithRole('admin'), getUserDetails)
router.put('/details/:email', verifyJWTWithRole('admin'), updateUserDetails)
router.put(
  '/membership/:membershipId',
  verifyJWTWithRole('admin'),
  updateMembership
)
router.delete(
  '/membership/:membershipId',
  verifyJWTWithRole('admin'),
  deleteMembership
)
router.put('/qr/:qrId', verifyJWTWithRole('admin'), updateQRCode)
router.delete('/qr/:qrId', verifyJWTWithRole('admin'), deleteQRCode)
router.get('/:email', verifyJWTWithRole(), userType)
router.get('/membershipdata/:email', verifyJWTWithRole(), userMembershipData)
module.exports = router
