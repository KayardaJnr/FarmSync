import React, { useState, useEffect } from 'react';
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

  const [Recharts, setRecharts] = useState(null);

  useEffect(() => {
    let mounted = true;
    import('recharts').then((mod) => {
      if (mounted) setRecharts(mod);
    }).catch((err) => console.error('Failed to load charts', err));
    return () => { mounted = false; };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Analytics Dashboard</h1>
      <div className={styles.chartsGrid}>
       
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Production vs. Feed (Last 7 Days)</h3>
          {Recharts ? (
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.BarChart data={productionData} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="name" />
                <Recharts.YAxis />
                <Recharts.Tooltip />
                <Recharts.Legend />
                <Recharts.Bar dataKey="Crates" fill="#1D9E53" />
                <Recharts.Bar dataKey="Bags" fill="#FFBB28" />
              </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
          ) : (
            <div className={styles.loadingChart}>Loading chart...</div>
          )}
        </div>
       
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Profit & Loss Over Time</h3>
          {Recharts ? (
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.LineChart data={profitData} margin={{ top: 5, right: 20, bottom: 40, left: 10 }}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="name" />
                <Recharts.YAxis tickFormatter={(val) => `₦${val/1000}k`} />
                <Recharts.Tooltip formatter={(val) => `₦${val.toLocaleString()}`} />
                <Recharts.Legend />
                <Recharts.Line type="monotone" dataKey="Sales" stroke="#1D9E53" strokeWidth={2} />
                <Recharts.Line type="monotone" dataKey="Expenses" stroke="#EF4444" strokeWidth={2} />
                <Recharts.Line type="monotone" dataKey="Profit" stroke="#3B82F6" strokeWidth={2} />
              </Recharts.LineChart>
            </Recharts.ResponsiveContainer>
          ) : (
            <div className={styles.loadingChart}>Loading chart...</div>
          )}
        </div>
       
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Expense Breakdown</h3>
          {Recharts ? (
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.PieChart>
                <Recharts.Pie 
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
                    <Recharts.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Recharts.Pie>
                <Recharts.Tooltip formatter={(val) => `₦${val.toLocaleString()}`} />
                <Recharts.Legend />
              </Recharts.PieChart>
            </Recharts.ResponsiveContainer>
          ) : (
            <div className={styles.loadingChart}>Loading chart...</div>
          )}
        </div>
       
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Mortality Rate by Batch</h3>
          {Recharts ? (
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.BarChart data={mortalityData} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="name" />
                <Recharts.YAxis />
                <Recharts.Tooltip />
                <Recharts.Legend />
                <Recharts.Bar dataKey="Mortality" fill="#EF4444" />
              </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
          ) : (
            <div className={styles.loadingChart}>Loading chart...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;