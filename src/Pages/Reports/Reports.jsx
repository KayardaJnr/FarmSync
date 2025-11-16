import React, { useState } from 'react';
import { Download, Printer, FileText, Calendar, Filter, TrendingUp, DollarSign, Package, Bird, BarChart3 } from 'lucide-react';
import DatePicker from '../../components/common/DatePicker/DatePicker';
import styles from './Reports.module.css';

const ReportsPage = ({ data }) => {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const reportTypes = [
    { id: 'summary', label: 'Farm Summary', icon: FileText },
    { id: 'production', label: 'Production Report', icon: Package },
    { id: 'financial', label: 'Financial Report', icon: DollarSign },
    { id: 'inventory', label: 'Inventory Report', icon: BarChart3 },
    { id: 'batch', label: 'Batch Performance', icon: Bird },
    { id: 'health', label: 'Health Report', icon: TrendingUp },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (format) => {
    // This would connect to your backend to generate the report
    alert(`Downloading ${reportType} report as ${format.toUpperCase()}...`);
  };

  // Calculate report data
  const calculateReportData = () => {
    const totalExpenses = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalSales = data.sales.reduce((acc, curr) => acc + curr.amount, 0);
    const profit = totalSales - totalExpenses;
    const profitMargin = totalSales > 0 ? ((profit / totalSales) * 100).toFixed(2) : 0;

    return {
      totalBirds: data.stats.totalBirds,
      activeBatches: data.batches.filter(b => b.status === 'active').length,
      totalProduction: data.dailySummary.eggs,
      feedUsed: data.dailySummary.feed,
      totalMortality: data.stats.mortality,
      totalExpenses,
      totalSales,
      profit,
      profitMargin,
      inventoryValue: data.inventory.reduce((acc, item) => acc + (item.stock * 100), 0), // Approximate
    };
  };

  const reportData = calculateReportData();

  const SummaryReport = () => (
    <div className={styles.reportContent}>
      <div className={styles.reportHeader}>
        <h2 className={styles.reportTitle}>Farm Summary Report</h2>
        <p className={styles.reportDate}>
          Period: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Overview</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Total Birds</span>
            <span className={styles.metricValue}>{reportData.totalBirds.toLocaleString()}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Active Batches</span>
            <span className={styles.metricValue}>{reportData.activeBatches}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Total Mortality</span>
            <span className={styles.metricValue}>{reportData.totalMortality}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Mortality Rate</span>
            <span className={styles.metricValue}>
              {((reportData.totalMortality / reportData.totalBirds) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Production Summary</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Total Eggs (Crates)</span>
            <span className={styles.metricValue}>{reportData.totalProduction.toLocaleString()}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Feed Consumed (Bags)</span>
            <span className={styles.metricValue}>{reportData.feedUsed.toLocaleString()}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Feed Efficiency</span>
            <span className={styles.metricValue}>
              {reportData.feedUsed > 0 ? (reportData.totalProduction / reportData.feedUsed).toFixed(2) : 0} crates/bag
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Financial Summary</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Total Revenue</span>
            <span className={`${styles.metricValue} ${styles.positive}`}>₦{reportData.totalSales.toLocaleString()}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Total Expenses</span>
            <span className={`${styles.metricValue} ${styles.negative}`}>₦{reportData.totalExpenses.toLocaleString()}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Net Profit</span>
            <span className={`${styles.metricValue} ${reportData.profit >= 0 ? styles.positive : styles.negative}`}>
              ₦{reportData.profit.toLocaleString()}
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Profit Margin</span>
            <span className={styles.metricValue}>{reportData.profitMargin}%</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Batch Details</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Breed</th>
              <th>Quantity</th>
              <th>Age</th>
              <th>Mortality</th>
              <th>Health Status</th>
            </tr>
          </thead>
          <tbody>
            {data.batches.map((batch) => (
              <tr key={batch.id}>
                <td>{batch.id}</td>
                <td>{batch.breed}</td>
                <td>{batch.quantity.toLocaleString()}</td>
                <td>{batch.age}</td>
                <td>{batch.mortality}</td>
                <td>
                  <span className={`${styles.badge} ${styles[batch.health.toLowerCase()]}`}>
                    {batch.health}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Inventory Status</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.item}</td>
                <td>{item.category}</td>
                <td>{item.stock.toLocaleString()}</td>
                <td>{item.unit}</td>
                <td>
                  <span className={`${styles.badge} ${item.stock < item.low_stock_threshold ? styles.low : styles.ok}`}>
                    {item.stock < item.low_stock_threshold ? 'Low' : 'OK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ProductionReport = () => (
    <div className={styles.reportContent}>
      <div className={styles.reportHeader}>
        <h2 className={styles.reportTitle}>Production Report</h2>
        <p className={styles.reportDate}>
          Period: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Production Metrics</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Total Eggs Produced</span>
            <span className={styles.metricValue}>{reportData.totalProduction.toLocaleString()} crates</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Daily Average</span>
            <span className={styles.metricValue}>
              {(reportData.totalProduction / 30).toFixed(1)} crates/day
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Production per Bird</span>
            <span className={styles.metricValue}>
              {reportData.totalBirds > 0 ? (reportData.totalProduction / reportData.totalBirds).toFixed(2) : 0} crates/bird
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Feed Consumption</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Total Feed Used</span>
            <span className={styles.metricValue}>{reportData.feedUsed.toLocaleString()} bags</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Feed per Bird</span>
            <span className={styles.metricValue}>
              {reportData.totalBirds > 0 ? (reportData.feedUsed / reportData.totalBirds).toFixed(3) : 0} bags/bird
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Feed Conversion Ratio</span>
            <span className={styles.metricValue}>
              {reportData.feedUsed > 0 ? (reportData.totalProduction / reportData.feedUsed).toFixed(2) : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const FinancialReport = () => (
    <div className={styles.reportContent}>
      <div className={styles.reportHeader}>
        <h2 className={styles.reportTitle}>Financial Report</h2>
        <p className={styles.reportDate}>
          Period: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Revenue</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Total Sales</span>
            <span className={`${styles.metricValue} ${styles.positive}`}>₦{reportData.totalSales.toLocaleString()}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Number of Transactions</span>
            <span className={styles.metricValue}>{data.sales.length}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Average Transaction</span>
            <span className={styles.metricValue}>
              ₦{data.sales.length > 0 ? (reportData.totalSales / data.sales.length).toLocaleString(0) : 0}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Expenses Breakdown</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>{expense.category}</td>
                <td>₦{expense.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Profitability</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Total Expenses</span>
            <span className={`${styles.metricValue} ${styles.negative}`}>₦{reportData.totalExpenses.toLocaleString()}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Net Profit</span>
            <span className={`${styles.metricValue} ${reportData.profit >= 0 ? styles.positive : styles.negative}`}>
              ₦{reportData.profit.toLocaleString()}
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Profit Margin</span>
            <span className={styles.metricValue}>{reportData.profitMargin}%</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>ROI</span>
            <span className={styles.metricValue}>
              {reportData.totalExpenses > 0 ? ((reportData.profit / reportData.totalExpenses) * 100).toFixed(2) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (reportType) {
      case 'summary':
        return <SummaryReport />;
      case 'production':
        return <ProductionReport />;
      case 'financial':
        return <FinancialReport />;
      case 'inventory':
      case 'batch':
      case 'health':
        return (
          <div className={styles.reportContent}>
            <div className={styles.emptyState}>
              <FileText size={64} className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>Report Coming Soon</h3>
              <p className={styles.emptyText}>
                The {reportTypes.find(r => r.id === reportType)?.label} is currently under development.
              </p>
            </div>
          </div>
        );
      default:
        return <SummaryReport />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reports</h1>
          <p className={styles.subtitle}>Generate and download comprehensive farm reports</p>
        </div>
        <div className={styles.actions}>
          <button onClick={handlePrint} className={styles.actionButton}>
            <Printer size={18} />
            Print
          </button>
          <button onClick={() => handleDownload('pdf')} className={styles.actionButton}>
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.reportTypes}>
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`${styles.reportType} ${reportType === type.id ? styles.active : ''}`}
              >
                <Icon size={20} />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.dateFilters}>
          <div className={styles.datePickerWrapper}>
            <label className={styles.label}>Start Date</label>
            <DatePicker
              value={dateRange.start}
              onSelect={(date) => setDateRange({ ...dateRange, start: date.toISOString().split('T')[0] })}
            />
          </div>
          <div className={styles.datePickerWrapper}>
            <label className={styles.label}>End Date</label>
            <DatePicker
              value={dateRange.end}
              onSelect={(date) => setDateRange({ ...dateRange, end: date.toISOString().split('T')[0] })}
            />
          </div>
        </div>
      </div>

      <div className={styles.reportContainer}>
        {renderReport()}
      </div>
    </div>
  );
};

export default ReportsPage;