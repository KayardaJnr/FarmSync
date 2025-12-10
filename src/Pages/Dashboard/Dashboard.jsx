import React from 'react';
import { Bird, Package, HeartPulse, DollarSign, PlusCircle, Search, AlertCircle, AlertTriangle, Info, Skull } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/common/StatCard/StatCard';
import styles from './Dashboard.module.css';

const DashboardPage = ({ data, setActiveNav }) => {
  const inventoryPieData = [
    { name: 'Layer Mash', value: data.inventory.find(i => i.item === 'Layer Mash')?.stock || 0 },
    { name: 'Grower Mash', value: data.inventory.find(i => i.item === 'Grower Mash')?.stock || 0 },
  ].filter(item => item.value > 0);
 
  const COLORS = ['#342ab9ff', '#ff9a53ff'];

  const productionData = [
    { name: 'Mon', Crates: 50, Bags: 20 },
    { name: 'Tue', Crates: 55, Bags: 22 },
    { name: 'Wed', Crates: 60, Bags: 21 },
    { name: 'Thu', Crates: 62, Bags: 25 },
    { name: 'Fri', Crates: 58, Bags: 23 },
    { name: 'Sat', Crates: 61, Bags: 24 },
    { name: 'Sun', Crates: 60, Bags: 22 },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard Overview</h1>
     
      <div className={styles.statsGrid}>
        <StatCard title="Total Birds" value={data.batches.reduce((acc, b) => acc + b.quantity, 0).toLocaleString()} icon={Bird} color="blue" />
        <StatCard title="Eggs Produced" value={data.dailySummary.eggs} icon={Package} color="yellow" />
        <StatCard title="Feed Used (Today)" value={`${data.dailySummary.feed} bags`} icon={Package} color="green" />
        <StatCard title="Sick Birds (Today)" value={data.dailySummary.sick} icon={HeartPulse} color="yellow" />
        <StatCard title="Mortality (Today)" value={data.dailySummary.mortality} icon={Skull} color="red" />
        <StatCard title="Total Sales" value={`₦${data.sales?.reduce((acc, s) => acc + s.amount, 0).toLocaleString() || 0}`} icon={DollarSign} color="green" />

      </div>
     
      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Quick Actions */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
            <div className={styles.actionsList}>
              {[
                { label: 'Record Daily Production', page: 'Quick Entry', color: 'green', icon: PlusCircle },
                { label: 'View All Batches', page: 'Batch Management', color: 'blue', icon: Search },
                { label: 'Check Health Logs', page: 'Health Monitoring', color: 'purple', icon: HeartPulse },
                { label: 'Add New Expense', page: 'Expense & Profit Tracking', color: 'red', icon: DollarSign },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button 
                    key={i} 
                    onClick={() => setActiveNav(action.page)}
                    className={`${styles.actionButton} ${styles[action.color]}`}
                  >
                    <Icon size={18} />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
         
          {/* Batch Health */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Batch Health Overview</h3>
            <div className={styles.batchList}>
              {data.batches.filter(b => b.status === 'active').slice(0, 4).map(batch => (
                <div key={batch.id} className={styles.batchItem}>
                  <div>
                    <span className={styles.batchId}>{batch.id}</span>
                    <span className={styles.batchBreed}>({batch.breed})</span>
                  </div>
                  <div className={`${styles.health} ${batch.health === 'Excellent' ? styles.excellent : styles.good}`}>
                    {batch.health}
                  </div>
                </div>
              ))}
              {data.batches.filter(b => b.status === 'active').length === 0 && (
                <p className={styles.emptyText}>No active batches.</p>
              )}
            </div>
          </div>
         
          {/* Inventory Pie Chart */}
          <div className={`${styles.card} ${styles.chartCard}`}>
            <h3 className={styles.cardTitle}>Inventory Levels (Bags)</h3>
            {inventoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={inventoryPieData} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    outerRadius={100} 
                    fill="#8884d8" 
                    dataKey="value" 
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {inventoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `${val} bags`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.emptyChart}>No inventory data (bags)</div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Alerts */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Recent Alerts & Notifications</h3>
            <div className={styles.alertsList}>
              {data.notifications.filter(n => !n.read).slice(0, 3).map((n, i) => {
                let Icon, colorClass;
                switch(n.type) {
                  case 'critical': Icon = AlertCircle; colorClass = 'critical'; break;
                  case 'warning': Icon = AlertTriangle; colorClass = 'warning'; break;
                  default: Icon = Info; colorClass = 'info';
                }
                return (
                  <div key={n.id || i} className={`${styles.alert} ${styles[colorClass]}`}>
                    <Icon size={20} className={styles.alertIcon} />
                    <div>
                      <p className={styles.alertTitle}>{n.title}</p>
                      <p className={styles.alertMessage}>{n.message}</p>
                      <p className={styles.alertTime}>{n.time}</p>
                    </div>
                  </div>
                );
              })}
              {data.notifications.filter(n => !n.read).length === 0 && (
                <p className={styles.emptyText}>No new notifications.</p>
              )}
            </div>
          </div>
         
          {/* Production Chart */}
          <div className={`${styles.card} ${styles.chartCard}`}>
            <h3 className={styles.cardTitle}>Production vs. Feed (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;