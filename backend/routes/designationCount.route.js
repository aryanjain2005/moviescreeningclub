const express = require('express');
const router = express.Router();
const {updateDesignationCounts, getMonthlyDesignationCounts} = require('../controllers/designationCount.controller');

// Route to update designation counts based on user emails
router.post('/update-designation-counts', updateDesignationCounts);

// Route to get all designation counts
router.get('/designation-counts', getMonthlyDesignationCounts);

module.exports = router;
