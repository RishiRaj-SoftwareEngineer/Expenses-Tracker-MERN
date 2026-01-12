import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import InfoCard from '../../components/Cards/InfoCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpensesList from '../../components/Dashboard/ExpensesList';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import IncomeLast60Days from '../../components/Dashboard/IncomeLast60Days';
import IncomeList from '../../components/Dashboard/IncomeList';
import { IoMdCard } from 'react-icons/io';
import { addThousandSeparators } from '../../utils/helper';
import { LuHandCoins,LuWalletMinimal } from 'react-icons/lu';

function Home() {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          API_PATHS.DASHBOARD.GET_DATA
        );

        if (response?.data) {
          console.log('Dashboard data received:', response.data);
          console.log('Last 30 days expenses:', response.data.last30DaysExpense);
          console.log('Last 30 days transactions:', response.data.last30DaysExpense?.transactions);
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance "
            value={addThousandSeparators(dashboardData?.totalBalance || 0)}
             color="bg-primary"
          />
<InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income "
            value={addThousandSeparators(dashboardData?.totalIncome || 0)}
             color="bg-green-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense "
            value={addThousandSeparators(dashboardData?.totalExpense || 0)}
             color="bg-red-500"
          />
         </div>
         
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.lastTransactions || []}
          onSeeMore={() => navigate('/expense')}
          />
        <FinanceOverview
        totalBalance={dashboardData?.totalBalance || 0}
        totalIncome={dashboardData?.totalIncome || 0}
        totalExpense={dashboardData?.totalExpense || 0}
        />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ExpensesList
            expenses={dashboardData?.last30DaysExpense?.transactions || []}
            onSeeMore={() => navigate('/expense')}
          />
          <Last30DaysExpenses
            expenses={dashboardData?.last30DaysExpense?.transactions || []}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <IncomeList
            income={dashboardData?.last60DaysIncome}
            onSeeMore={() => navigate('/income')}
          />
          <IncomeLast60Days income={dashboardData?.last60DaysIncome} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Home;
