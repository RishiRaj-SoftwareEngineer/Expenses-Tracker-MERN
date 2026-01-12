import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from 'recharts';
import moment from 'moment';
import { LuPlus } from 'react-icons/lu';
import { addThousandSeparators } from '../../utils/helper';

const ExpenseOverview = ({ expenses, loading = false, onAddExpense }) => {
  const expenseArray = Array.isArray(expenses) ? expenses : [];

  const { chartData, maxAmount } = useMemo(() => {
    const byDate = expenseArray.reduce((acc, expense) => {
      const date = moment(expense.date);
      if (!date.isValid()) return acc;
      const key = date.format('YYYY-MM-DD');

      if (!acc[key]) {
        acc[key] = { total: 0, categories: {} };
      }

      acc[key].total += expense.amount || 0;
      const cat = expense.category || 'Expense';
      acc[key].categories[cat] = (acc[key].categories[cat] || 0) + (expense.amount || 0);
      return acc;
    }, {});
    // Build a continuous 45-day window (oldest to newest) so every date shows
    const today = moment();
    const start = today.clone().subtract(29, 'days');
    const range = [];
    for (let i = 0; i < 30; i++) {
      const d = start.clone().add(i, 'days');
      const key = d.format('YYYY-MM-DD');
      range.push({ key, dateLabel: d.format('Do MMM'), raw: byDate[key] });
    }

    const data = range.map(({ key, dateLabel, raw }) => {
      if (!raw) {
        return { date: dateLabel, amount: 0, topCategory: undefined };
      }
      const topCategory = Object.entries(raw.categories)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      return {
        date: dateLabel,
        amount: Number((raw.total || 0).toFixed(2)),
        topCategory,
      };
    });

    const max = data.reduce((m, d) => Math.max(m, d.amount), 0);
    return { chartData: data, maxAmount: max };
  }, [expenseArray]);

  const chartMax = Math.max(500, Math.ceil((maxAmount || 0) / 250) * 250);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, amount, topCategory } = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          {topCategory && <p className="text-xs font-semibold text-purple-700 mb-0.5">{topCategory}</p>}
          <p className="text-xs text-gray-500">{date}</p>
          <p className="text-sm font-bold text-purple-600">${addThousandSeparators(amount)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h5 className="text-lg font-semibold">Expense Overview</h5>
          <p className="text-sm text-gray-500 mt-1">Track your spending trends over time and gain insights into where your money goes.</p>
        </div>
        {onAddExpense && (
          <button
            type="button"
            onClick={onAddExpense}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-lg transition"
          >
            <LuPlus className="text-base" /> Add Expense
          </button>
        )}
      </div>

      {loading ? (
        <div className="h-72 rounded-xl bg-gray-50 border border-dashed border-gray-200 animate-pulse" />
      ) : chartData.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-gray-500 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
          No expense data yet. Add your first expense to see the trend.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="expenseArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.06} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f0f5" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${addThousandSeparators(value)}`}
              domain={[0, chartMax]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#a78bfa', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area type="monotone" dataKey="amount" stroke="none" fill="url(#expenseArea)" />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={{ r: 4, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExpenseOverview;
