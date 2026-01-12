const express = require('express');

const {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel
}= require('../controllers/incomeController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addIncome);

router.get('/get', protect, getAllIncome);
router.get('/all', protect, getAllIncome);

router.delete('/:id', protect, deleteIncome);

// Single canonical path for Excel download (hyphenated)
router.get('/download-excel', protect, downloadIncomeExcel);

module.exports = router;
