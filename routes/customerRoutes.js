const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// API routes for transactions page
router.get('/api/search', customerController.apiSearchCustomers);
router.get('/api/:query', customerController.apiGetCustomer);

router.get('/', customerController.getAll);
router.post('/add', customerController.add);
router.get('/:id', customerController.getProfile);
router.post('/edit/:id', customerController.edit);
router.post('/delete/:id', customerController.delete);

module.exports = router;
