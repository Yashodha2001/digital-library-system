const express = require('express');
const {
  adminLogin,
  studentRegister,
  studentLogin,
  getProfile,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/student/register', studentRegister);
router.post('/student/login', studentLogin);
router.get('/profile', authenticate, getProfile);

module.exports = router;
