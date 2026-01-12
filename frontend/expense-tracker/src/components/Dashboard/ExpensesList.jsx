import React from 'react';
import { LuArrowRight, LuDownload } from 'react-icons/lu';
import moment from 'moment';
import { getCategoryIcon, addThousandSeparators } from '../../utils/helper';

const ExpensesList = ({ expenses, onSeeMore, onDownload, hideSeeAll = false }) => {
  // Ensure expenses is an array
  const expensesArray = Array.isArray(expenses) ? expenses : [];
  
  // Keep only last 30 days expenses, sorted by newest first
  const now = React.useMemo(() => moment(), []);
  const recentExpenses = React.useMemo(() => {
    const cutoff = now.clone().subtract(30, 'days');
    const filtered = expensesArray
      .filter(exp => {
        const d = moment(exp.date);
        return d.isValid() && d.isSameOrAfter(cutoff);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log('ExpensesList - received', expensesArray.length, 'expenses; recent (<=30d):', filtered.length);
    return filtered;
  }, [expensesArray, now]);

  // Calculate total expenses (recent window)
  const totalExpenses = recentExpenses.length > 0 
    ? recentExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
    : 0;

  const showSeeAll = !hideSeeAll && typeof onSeeMore === 'function';

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-lg font-semibold">Expenses</h5>
        {(showSeeAll || onDownload) && (
          <div className="flex items-center gap-2">
            {showSeeAll && (
              <button className="card-btn text-sm" onClick={onSeeMore}>
                See All <LuArrowRight className="text-sm" />
              </button>
            )}
            {onDownload && (
              <button
                className="card-btn text-sm text-purple-700 border-purple-100 bg-purple-50 hover:bg-purple-100"
                onClick={onDownload}
              >
                <LuDownload className="text-sm" /> Download
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {recentExpenses.length > 0 ? (
          recentExpenses.slice(0, 4).map((expense) => (
            <div key={expense._id || expense.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
              {/* Icon */}
              <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-100 rounded-full flex-shrink-0">
                <span>{getCategoryIcon(expense.category, 'expense')}</span>
              </div>

              {/* Category and Date */}
              <div className="flex-1 min-w-0">
                <h6 className="text-sm font-medium text-gray-800">{expense.category}</h6>
                <p className="text-xs text-gray-500">{moment(expense.date).format('DD MMM YYYY')}</p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-red-600">-${addThousandSeparators(expense.amount)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No expenses found</p>
        )}
      </div>

      {/* Total Expenses Spent */}
      {recentExpenses.length > 0 && (
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Expenses Spent</span>
            <span className="text-lg font-bold text-red-600">${addThousandSeparators(totalExpenses)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesList;
