const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', businessController.getAll);
router.post('/add', businessController.add);
router.post('/edit/:id', businessController.edit);
router.post('/delete/:id', businessController.delete);

module.exports = router;
