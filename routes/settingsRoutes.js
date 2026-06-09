const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', settingsController.getIndex);
router.post('/profile', settingsController.updateProfile);
router.post('/password', settingsController.changePassword);

module.exports = router;
