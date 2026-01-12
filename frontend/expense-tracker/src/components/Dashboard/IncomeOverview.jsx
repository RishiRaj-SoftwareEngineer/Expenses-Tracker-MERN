import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import moment from 'moment';
import { LuPlus } from 'react-icons/lu';
import { addThousandSeparators } from '../../utils/helper';

const IncomeOverview = ({ incomes, loading = false, onAddIncome }) => {
  const incomeArray = Array.isArray(incomes) ? incomes : [];

  const { chartData, totalIncome, maxAmount } = useMemo(() => {
    const byDate = incomeArray.reduce((acc, income) => {
      const date = moment(income.date);
      if (!date.isValid()) return acc;

      const key = date.format('YYYY-MM-DD');
      acc[key] = (acc[key] || 0) + (income.amount || 0);
      return acc;
    }, {});

    const sorted = Object.entries(byDate)
      .map(([key, amount]) => ({ key, amount }))
      .sort((a, b) => new Date(a.key) - new Date(b.key));

    const limited = sorted.slice(-12);
    const data = limited.map((item) => ({
      date: moment(item.key).format('Do MMM'),
      amount: Number((item.amount || 0).toFixed(2)),
    }));

    const total = incomeArray.reduce((sum, item) => sum + (item.amount || 0), 0);
    const max = data.reduce((m, item) => Math.max(m, item.amount), 0);

    return { chartData: data, totalIncome: total, maxAmount: max };
  }, [incomeArray]);

  const handleAddIncome = () => {
    if (onAddIncome) {
      onAddIncome();
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, amount } = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs text-gray-500">{date}</p>
          <p className="text-sm font-bold text-purple-600">${addThousandSeparators(amount)}</p>
        </div>
      );
    }
    return null;
  };

  const chartMax = Math.max(1000, Math.ceil((maxAmount || 0) / 500) * 500);

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h5 className="text-lg font-semibold">Income Overview</h5>
          <p className="text-sm text-gray-500 mt-1">Track your earnings over time and analyze your income trends.</p>
        </div>
        <button
          type="button"
          onClick={handleAddIncome}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-500 rounded-lg shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40 transition"
        >
          <LuPlus className="text-base" />
          Add Income
        </button>
      </div>

      {loading ? (
        <div className="h-64 rounded-xl bg-gray-50 border border-dashed border-gray-200 animate-pulse" />
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
          No income data yet. Add your first income to see the trend.
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Showing the most recent {chartData.length} days with income
            </div>
            <div className="text-sm font-semibold text-purple-600">
              Total: ${addThousandSeparators(totalIncome)}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeBarPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="incomeBarSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c4b5fd" stopOpacity={1} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.9} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f0f5" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-15}
                height={40}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${addThousandSeparators(value)}`}
                domain={[0, chartMax]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f3ff' }} />
              <Bar dataKey="amount" radius={[10, 10, 0, 0]} barSize={36}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`${entry.date}-${index}`}
                    fill={index % 2 === 0 ? 'url(#incomeBarPrimary)' : 'url(#incomeBarSecondary)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default IncomeOverview;
