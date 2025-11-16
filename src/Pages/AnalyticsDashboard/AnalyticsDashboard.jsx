import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import styles from './AnalyticsDashboard.module.css';

const AnalyticsDashboardPage = ({ data }) => {
  const productionData = [
    { name: 'Mon', Crates: 50, Bags: 20 },
    { name: 'Tue', Crates: 55, Bags: 22 },
    { name: 'Wed', Crates: 60, Bags: 21 },
    { name: 'Thu', Crates: 62, Bags: 25 },
    { name: 'Fri', Crates: 58, Bags: 23 },
    { name: 'Sat', Crates: 61, Bags: 24 },
    { name: 'Sun', Crates: 60, Bags: 22 },
  ];

  const profitData = [
    { name: 'Jan', Sales: 400000, Expenses: 240000, Profit: 160000 },
    { name: 'Feb', Sales: 300000, Expenses: 190000, Profit: 110000 },
    { name: 'Mar', Sales: 500000, Expenses: 280000, Profit: 220000 },
    { name: 'Apr', Sales: 450000, Expenses: 220000, Profit: 230000 },
    { name: 'May', Sales: 550000, Expenses: 300000, Profit: 250000 },
  ];
 
  const expenseData = data.expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);
 
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const mortalityData = data.batches.map(b => ({ name: b.id, Mortality: b.mortality }));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Analytics Dashboard</h1>
      <div className={styles.chartsGrid}>
       
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Production vs. Feed (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productionData} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Crates" fill="#1D9E53" />
              <Bar dataKey="Bags" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>
       
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Profit & Loss Over Time</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitData} margin={{ top: 5, right: 20, bottom: 40, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(val) => `₦${val/1000}k`} />
              <Tooltip formatter={(val) => `₦${val.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="Sales" stroke="#1D9E53" strokeWidth={2} />
              <Line type="monotone" dataKey="Expenses" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Profit" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
       
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={expenseData} 
                cx="50%" 
                cy="50%" 
                labelLine={false} 
                outerRadius={120} 
                fill="#8884d8" 
                dataKey="value" 
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `₦${val.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
       
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Mortality Rate by Batch</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mortalityData} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Mortality" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;