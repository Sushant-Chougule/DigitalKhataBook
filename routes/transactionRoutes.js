const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', transactionController.getAll);
router.get('/add', transactionController.getAddTransaction);
router.post('/add', transactionController.add);
router.get('/edit/:id', transactionController.getEdit);
router.post('/edit/:id', transactionController.postEdit);
router.post('/delete/:id', transactionController.delete);

module.exports = router;
