const xlsx = require('xlsx');
const Expense = require('../models/Expense');

// Add Expense Source

exports.addExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validate required fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();

        res.status(201).json({ message: 'Expense source added successfully', expense: newExpense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
};

// Get All Expense Sources for a User
exports.getAllExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json({ expenses });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an Expense Source
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const expense = await Expense.findById(id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense source not found' });
        }

        // Verify that the expense belongs to the current user
        if (expense.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this expense' });
        }

        await Expense.findByIdAndDelete(id);

        res.status(200).json({ message: 'Expense category deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Download Expense Sources as Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        //prepare data for excel
        const data = expenses.map(expense => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: new Date(expense.date).toLocaleDateString(),
        }));

        // Generate Excel file
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(
            expenses.map(expense => ({
                Category: expense.category,
                Amount: expense.amount,
                Date: new Date(expense.date).toLocaleDateString(),
            }))
        );
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Expense');
        
        // Write workbook to a binary buffer and send
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        res.setHeader('Content-Disposition', 'attachment; filename=expense_report.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length);
        return res.end(buffer);
    } catch (error) {
        console.error('Error downloading expense:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
