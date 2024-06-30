const express = require('express')
const router = express.Router()
const {
  fetchMembership,
  saveMembership,
  checkMembership,
  suspendMembership,
  requestMembership
} = require('@/controllers/user/memberships.controller')
const verifyJWTWithRole = require('@/middleware')

router.get('/', verifyJWTWithRole(), fetchMembership)
router.post('/redirect', saveMembership)
router.post('/request', verifyJWTWithRole(), requestMembership)
router.get('/check', verifyJWTWithRole(), checkMembership)
router.put('/suspend/:id', verifyJWTWithRole(), suspendMembership)
module.exports = router
