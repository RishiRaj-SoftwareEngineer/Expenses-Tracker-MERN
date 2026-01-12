import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const Last30DaysExpenses = ({ expenses }) => {
  // Ensure expenses is an array
  const expensesArray = Array.isArray(expenses) ? expenses : [];
  
  // Process data for the last 30 days
  const chartData = useMemo(() => {
    const last30Days = {};
    const today = moment();

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = today.clone().subtract(i, 'days');
      const dayKey = date.format('DD MMM');
      last30Days[dayKey] = 0;
    }

    // Add only expense amounts (filter by type) to corresponding days
    expensesArray.forEach((expense) => {
      if (expense.type === 'expense' || !expense.type) { // Include if type is 'expense' or undefined
        const expenseDate = moment(expense.date);
        if (expenseDate.isBetween(today.clone().subtract(30, 'days'), today, null, '[]')) {
          const dayKey = expenseDate.format('DD MMM');
          if (last30Days.hasOwnProperty(dayKey)) {
            last30Days[dayKey] += expense.amount;
          }
        }
      }
    });

    // Convert to array preserving daily order (oldest -> newest)
    const dailyData = Object.entries(last30Days).map(([date, amount]) => ({ date, amount }));

    return dailyData;
  }, [expensesArray]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs text-gray-600">{payload[0].payload.date}</p>
          <p className="text-sm font-bold text-purple-600">${payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6">
      <h5 className="text-lg font-semibold mb-6">Last 30 Days Expenses</h5>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="amount" 
            fill="#a855f7" 
            radius={[8, 8, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Last30DaysExpenses;
