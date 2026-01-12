import React from 'react';
import { LuTrendingUp, LuTrendingDown } from 'react-icons/lu';
import { addThousandSeparators } from '../../utils/helper';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  // Calculate data for the donut chart
  const chartData = [
    { name: 'Income', value: totalIncome, color: '#10b981' }, // green
    { name: 'Expense', value: totalExpense, color: '#ef4444' }, // red
    { name: 'Balance', value: Math.max(totalBalance, 0), color: '#a855f7' }, // purple
  ];

  // Filter out zero values for cleaner chart
  const filteredData = chartData.filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-sm font-bold text-gray-900">${addThousandSeparators(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const renderCenterContent = () => {
    return (
      <g>
        <text 
          x="50%" 
          y="45%" 
          fill="#666" 
          textAnchor="middle" 
          fontSize="13" 
          fontWeight="500"
        >
          Total Balance
        </text>
        <text 
          x="50%" 
          y="58%" 
          fill="#1f2937" 
          textAnchor="middle" 
          fontSize="26" 
          fontWeight="bold"
        >
          ${addThousandSeparators(totalBalance)}
        </text>
      </g>
    );
  };

  return (
    <div className="card p-6">
      <h5 className="text-lg font-semibold mb-6">Financial Overview</h5>
      
      {/* Donut Chart */}
      <div className="flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {renderCenterContent()}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-8 mb-8 flex justify-center gap-8 flex-wrap px-4">
        {filteredData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              {item.name}: <span style={{ color: item.color }} className="font-bold">${addThousandSeparators(item.value)}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FinanceOverview;
