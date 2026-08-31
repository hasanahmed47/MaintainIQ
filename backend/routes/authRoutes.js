const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleAuth, getMe, getTechnicians } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.get('/technicians', protect, authorize('admin'), getTechnicians);

module.exports = router;
