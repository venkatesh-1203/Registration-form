const express = require('express');
const router = express.Router();
const {
    createRegistration,
    getRegistrations,
} = require('../controllers/registrationController');
const { requireAdmin } = require('../controllers/adminController');

router.post('/register', createRegistration);
router.get('/registrations', requireAdmin, getRegistrations);

module.exports = router;
