import React from 'react';
import moment from 'moment';
import { LuArrowRight, LuDownload } from 'react-icons/lu';
import { addThousandSeparators, getCategoryIcon } from '../../utils/helper';

const IncomeList = ({ income, onSeeMore, onDownload, hideSeeAll = false }) => {
  const incomeArray = Array.isArray(income?.transactions) ? income.transactions : [];

  // Keep only last 60 days income, newest first
  const now = React.useMemo(() => moment(), []);
  const recentIncome = React.useMemo(() => {
    const cutoff = now.clone().subtract(60, 'days');
    return incomeArray
      .filter(txn => {
        const d = moment(txn.date);
        return d.isValid() && d.isSameOrAfter(cutoff);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [incomeArray, now]);

  const totalIncome = recentIncome.reduce((sum, txn) => sum + (txn.amount || 0), 0);

  const showSeeAll = !hideSeeAll && typeof onSeeMore === 'function';

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-lg font-semibold">Income</h5>
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
        {recentIncome.length > 0 ? (
          recentIncome.slice(0, 4).map((txn) => (
            <div key={txn._id || txn.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-100 rounded-full flex-shrink-0">
                <span>{getCategoryIcon(txn.source, 'income')}</span>
              </div>

              <div className="flex-1 min-w-0">
                <h6 className="text-sm font-medium text-gray-800">{txn.source || 'Income'}</h6>
                <p className="text-xs text-gray-500">{moment(txn.date).format('DD MMM YYYY')}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-green-600">+${addThousandSeparators(txn.amount)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No income found</p>
        )}
      </div>

      {recentIncome.length > 0 && (
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Income (60d)</span>
            <span className="text-lg font-bold text-green-600">${addThousandSeparators(totalIncome)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeList;