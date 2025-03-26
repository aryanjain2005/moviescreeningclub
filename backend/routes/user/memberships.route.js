const express = require('express')
const router = express.Router()
const {
  saveMembership,
  checkMembership,
  suspendMembership,
  requestMembership,
  assignBaseMembership,
  getMembershipPrices,
  setMembershipPrice,
  manualAdd
} = require('@/controllers/user/memberships.controller')
const { verifyJWTWithRole } = require('@/middleware')

router.post('/redirect', saveMembership)
router.post('/request', verifyJWTWithRole('standard'), requestMembership)
router.get('/check', verifyJWTWithRole('standard'), checkMembership)
router.post('/assign-base-membership', verifyJWTWithRole('admin'), assignBaseMembership)
router.get('/getprices', verifyJWTWithRole('standard'), getMembershipPrices)
router.post('/getprices', verifyJWTWithRole('admin'), setMembershipPrice)
router.post('/manual-add', verifyJWTWithRole('admin'), manualAdd)
// router.put('/suspend/:id', verifyJWTWithRole('standard'), suspendMembership)
module.exports = router
