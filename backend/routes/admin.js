const express = require('express');
const router = express.Router();
const { login, logout, requireAdmin, exportCsv } = require('../controllers/adminController');

router.post('/login', login);
router.post('/logout', logout);
router.get('/export', requireAdmin, exportCsv);

module.exports = router;
