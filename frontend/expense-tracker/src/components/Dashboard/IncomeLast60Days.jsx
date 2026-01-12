import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { addThousandSeparators } from '../../utils/helper';

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#a855f7', '#ef4444', '#6366f1'];

const IncomeLast60Days = ({ income }) => {
  const transactions = Array.isArray(income?.transactions) ? income.transactions : [];
  const totalIncome = income?.total ?? transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);

  const pieData = useMemo(() => {
    if (transactions.length === 0) return [];

    const grouped = transactions.reduce((acc, txn) => {
      const key = txn.source || 'Other';
      acc[key] = (acc[key] || 0) + (txn.amount || 0);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions]);

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

  const renderCenterContent = () => (
    <g>
      <text x="50%" y="44%" fill="#666" textAnchor="middle" fontSize="13" fontWeight="500">
        Income (60d)
      </text>
      <text x="50%" y="58%" fill="#1f2937" textAnchor="middle" fontSize="24" fontWeight="bold">
        ${addThousandSeparators(totalIncome)}
      </text>
    </g>
  );

  return (
    <div className="card p-6">
      <h5 className="text-lg font-semibold mb-6">Income (Last 60 Days)</h5>

      {pieData.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No income recorded in the last 60 days</p>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {renderCenterContent()}
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 px-4">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="text-sm font-medium text-gray-700">
                  {item.name}: <span style={{ color: COLORS[index % COLORS.length] }} className="font-bold">${addThousandSeparators(item.value)}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IncomeLast60Days;