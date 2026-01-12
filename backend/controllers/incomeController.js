const xlsx = require('xlsx');
const Income = require('../models/Income');

// Add Income Source

exports.addIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const { icon, source, amount, date } = req.body;

        // Validate required fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        await newIncome.save();

        res.status(201).json({ message: 'Income source added successfully', income: newIncome });
    } catch (error) {
        console.error('Error adding income:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
};

// Get All Income Sources for a User
exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json({ incomes });
    } catch (error) {
        console.error('Error fetching incomes:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an Income Source
exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const income = await Income.findById(id);

        if (!income) {
            return res.status(404).json({ message: 'Income source not found' });
        }

        // Verify that the income belongs to the current user
        if (income.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this income' });
        }

        await Income.findByIdAndDelete(id);

        res.status(200).json({ message: 'Income source deleted successfully' });
    } catch (error) {
        console.error('Error deleting income:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Download Income Sources as Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        //prepare data for excel
        const data = incomes.map(income => ({
            Source: income.source,
            Amount: income.amount,
            Date: new Date(income.date).toLocaleDateString(),
        }));

        // Generate Excel file
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(
            incomes.map(income => ({
                Source: income.source,
                Amount: income.amount,
                Date: new Date(income.date).toLocaleDateString(),
            }))
        );
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Income');
        
        // Write workbook to a binary buffer and send
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        res.setHeader('Content-Disposition', 'attachment; filename=income_report.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length);
        return res.end(buffer);
    } catch (error) {
        console.error('Error downloading income:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
