import React from 'react';
import Card2 from '../../assets/images/Card2.png';
import { LuTrendingUpDown } from 'react-icons/lu';

function AuthLayout({ children }) {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
      <h2 className="text-lg font-medium text-black">Expense Tracker</h2>
      {children}
      </div>

      <div className="hidden md:block w-[40vw] h-screen bg-gradient-to-br from-violet-100 to-purple-50 overflow-hidden p-10 relative">
        {/* Decorative shapes */}
        <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-600 absolute -top-8 -left-8 opacity-90" />
        <div className="w-40 h-52 rounded-[40px] border-[16px] border-fuchsia-500 absolute top-[35%] -right-8 opacity-80" />
        <div className="w-36 h-36 rounded-[40px] bg-gradient-to-br from-violet-500 to-purple-500 absolute -bottom-10 left-8 opacity-85" />

        {/* Main content with higher z-index */}
        <div className="relative z-20 flex flex-col gap-6 pt-8">
          <StatInfoCard
             icon={<LuTrendingUpDown />}
             label="Track Your Income & Expenses"
             value="$430,000"
             color="bg-gradient-to-br from-purple-600 to-fuchsia-600"
             />
        </div>
        
        {/* Transaction chart image */}
        <img
          src={Card2}
          alt="Transactions"
          className="w-[85%] absolute bottom-12 left-8 rounded-2xl shadow-2xl shadow-purple-400/30 z-10"
        />
        </div>
    </div>
  );
}

export default AuthLayout;

const StatInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-xl shadow-purple-200/50 max-w-md">
      <div className={`w-14 h-14 flex items-center justify-center text-[28px] text-white ${color} rounded-2xl shadow-lg`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};