import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { $, byCategory, calcTotals } from '../utils/helpers';
import { CATEGORIES, MONTHS } from '../utils/Constants';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend
} from 'recharts';
import './Dashboard.css';

const Card = ({ label, value, color }) => (
  <div className="card">
    <div className="label">{label}</div>
    <div className="value" style={{ color }}>{$(value)}</div>
  </div>
);

const NoDataMessage = () => (
  <div className="empty">
    <p> Add transactions to see charts</p>
    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
      Go to Transactions and add some income and expenses
    </p>
  </div>
);

export default function Dashboard() {
  const { transactions } = useApp();
  const [month, setMonth] = useState('');

  const filtered = month ? transactions.filter(t => t.date.startsWith(month)) : transactions;
  const data = calcTotals(filtered);

  const pieData = Object.entries(byCategory(filtered)).map(([cat, amt]) => {
    const c = CATEGORIES.find(x => x.id === cat);
    return { name: c?.name || cat, value: amt, color: c?.color || '#10b981' };
  });

  const getMonthlyData = () => {
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];

    allMonths.forEach((monthName, index) => {
      const monthTxs = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === index;
      });

      const monthData = calcTotals(monthTxs);

      if (monthData.income > 0 || monthData.expenses > 0 || monthData.balance > 0) {
        result.push({
          month: monthName,
          income: monthData.income,
          expenses: monthData.expenses,
          balance: monthData.balance,
        });
      }
    });

    return result;
  };

  const monthlyData = getMonthlyData();
  const hasData = monthlyData.length > 0;

  const incomeExpenseData = monthlyData.map(m => ({
    month: m.month,
    Income: m.income,
    Expenses: m.expenses,
  }));

  const balanceData = monthlyData.map(m => ({
    month: m.month,
    balance: m.balance,
  }));

  return (
    <div className="dashboard">
      <div className="header">
        <h1> Dashboard</h1>
        <select value={month} onChange={e => setMonth(e.target.value)}>
          <option value="">All Time</option>
          {MONTHS.map((m, i) => <option key={m} value={`2024-${String(i + 1).padStart(2, '0')}`}>{m}</option>)}
        </select>
      </div>

      <div className="cards">
        <Card label="Total Income" value={data.income} color="#10b981" />
        <Card label="Total Expenses" value={data.expenses} color="#ef4444" />
        <Card label="Net Balance" value={data.balance} color={data.balance >= 0 ? '#10b981' : '#ef4444'} />
      </div>

      <div className="charts-grid">
        <div className="chart-box full-width">
          <h3> Income vs Expenses by Month</h3>
          {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text2)' }} />
                <YAxis tickFormatter={$} tick={{ fill: 'var(--text2)' }} />
                <Tooltip formatter={v => $(v)} />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage />
          )}
        </div>

        <div className="chart-box">
          <h3> Balance Over Time</h3>
          {hasData ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text2)' }} />
                <YAxis tickFormatter={$} tick={{ fill: 'var(--text2)' }} />
                <Tooltip formatter={v => $(v)} />
                <Line type="monotone" dataKey="balance" stroke="var(--blue)" strokeWidth={3} dot={{ fill: 'var(--blue)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage />
          )}
        </div>

        <div className="chart-box">
          <h3> Spending by Category</h3>
          {pieData.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={v => $(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage />
          )}
        </div>
      </div>

    </div>
  );
}