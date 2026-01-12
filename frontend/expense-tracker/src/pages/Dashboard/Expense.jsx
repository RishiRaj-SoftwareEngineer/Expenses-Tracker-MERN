import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ExpenseOverview from '../../components/Dashboard/ExpenseOverview';
import ExpensesList from '../../components/Dashboard/ExpensesList';
import Input from '../../components/Inputs/Input';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

function Expense() {
  useUserAuth();
  const [expenses, setExpenses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    icon: '',
  });
  const [error, setError] = React.useState('');
  const ICON_CHOICES = ['🍔', '🛒', '🚗', '🛍️', '🎬', '🏥', '📚', '📄'];

  const fetchExpenses = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      setExpenses(response?.data?.expenses || []);
    } catch (err) {
      console.error('Failed to fetch expense list:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const resetForm = () => {
    setFormData({
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      icon: '',
    });
    setError('');
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.category || !formData.amount || !formData.date) {
      setError('Please fill category, amount, and date.');
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category: formData.category,
        amount: Number(formData.amount),
        date: formData.date,
        icon: formData.icon || undefined,
      });

      await fetchExpenses();
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to add expense:', err);
      setError('Could not add expense. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadExpense = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download expense report:', err);
      setError('Could not download expense report.');
    }
  };

  const expenseSummary = React.useMemo(
    () => ({ transactions: expenses, total: expenses.reduce((sum, item) => sum + (item.amount || 0), 0) }),
    [expenses]
  );

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="w-full py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            <p className="text-sm text-gray-500 mt-1">Track your spending, download reports, and add new expenses.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-500 rounded-lg shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40 transition"
          >
            Add Expense
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ExpenseOverview expenses={expenses} loading={loading} onAddExpense={() => setShowAddModal(true)} />
          <ExpensesList
            expenses={expenseSummary.transactions}
            onDownload={handleDownloadExpense}
            hideSeeAll
          />
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200 p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                aria-label="Close add expense"
              >
                ×
              </button>

              <h3 className="text-xl font-semibold text-gray-900 mb-1">Add Expense</h3>
              <p className="text-sm text-gray-500 mb-4">Log a new expense to keep your overview up to date.</p>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-2">Pick Icon</p>
                  <div className="grid grid-cols-4 gap-3">
                    {ICON_CHOICES.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`h-12 rounded-xl border flex items-center justify-center text-xl transition ${
                          formData.icon === icon
                            ? 'border-purple-500 bg-purple-50 shadow-sm'
                            : 'border-gray-200 hover:border-purple-200'
                        }`}
                        onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                        aria-label={`Select icon ${icon}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Category"
                  placeholder="e.g., Food, Transport"
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                />
                <Input
                  label="Amount"
                  placeholder="e.g., 120"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                />
                <Input
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 px-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-500 rounded-lg shadow-lg shadow-purple-500/30 transition hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Add Expense'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Expense;
