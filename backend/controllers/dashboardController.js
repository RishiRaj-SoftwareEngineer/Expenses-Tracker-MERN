const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { Types } = require('mongoose');

// Get Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userObjectId = new Types.ObjectId(userId);

        //fetch total income
        const totalIncomeResult = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60*24*60*60*1000) },
        }).sort({ date: -1 });

        const last60Days = last60DaysIncomeTransactions.reduce(
            (Sum, transaction) => Sum + transaction.amount, 0
        );
        
        //Get expense transactions of last 30 days (including today)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0); // Start of day 30 days ago
        
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today

        const last30DaysExpenseTransactions = (await Expense.find({
            userId,
            date: { 
                $gte: thirtyDaysAgo,
                $lte: today
            },
        }).sort({ date: -1 })).map(txn => 
            ({ ...txn.toObject(), type: 'expense' })
        );

        //Get total expense of last 30 days
        const last30Days = last30DaysExpenseTransactions.reduce(
            (Sum, transaction) => Sum + transaction.amount, 0
        );

        //Fetch last 5 transactions (income and expense both)
        const incomeTransactions = (await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => 
            ({ ...txn.toObject(), type: 'income' })
        );
        
        const expenseTransactions = (await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => 
            ({ ...txn.toObject(), type: 'expense' })
        );

        const lastTransactions = [...incomeTransactions, ...expenseTransactions].sort((a, b) => b.date - a.date);

        // Fetch all expenses for the expense list
        const allExpenses = (await Expense.find({ userId }).sort({ date: -1 })).map(txn => 
            ({ ...txn.toObject(), type: 'expense' })
        );

        console.log('Dashboard Data - User:', userId);
        console.log('Dashboard Data - Total Expenses:', totalExpense[0]?.total);
        console.log('Dashboard Data - All Expenses Count:', allExpenses.length);
        console.log('Dashboard Data - Last 30 Days Expenses Count:', last30DaysExpenseTransactions.length);
        console.log('Dashboard Data - Last 30 Days Expenses:', last30DaysExpenseTransactions);

        res.json({
            totalBalance: (totalIncomeResult[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncomeResult[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpense: {
                total: last30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: last60Days,
                transactions: last60DaysIncomeTransactions,
            },
            lastTransactions: lastTransactions,
            allExpenses: allExpenses,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};