import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard/Dashboard';
import QuickEntryPage from '../pages/QuickEntry/QuickEntry';
import BatchManagementPage from '../pages/BatchManagement/BatchManagement';
import MedicationLogPage from '../pages/MedicationLog/MedicationLog';
import InventoryManagementPage from '../pages/InventoryManagement/InventoryManagement';
import HealthMonitoringPage from '../pages/HealthMonitoring/HealthMonitoring';
import ExpenseProfitTrackingPage from '../pages/ExpenseProfitTracking/ExpenseProfitTracking';
import SalesDistributionPage from '../pages/SalesDistribution/SalesDistribution';
import AnalyticsDashboardPage from '../pages/AnalyticsDashboard/AnalyticsDashboard';
import NotificationsAlertsPage from '../pages/NotificationsAlerts/NotificationsAlerts';
import ReportsPage from '../pages/Reports/Reports';
import ProfilePage from '../pages/Profile/Profile';
import SettingsPage from '../pages/Settings/Settings';

const AppRoutes = ({ data, db, userId }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage data={data} />} />
      <Route path="/quick-entry" element={<QuickEntryPage data={data} db={db} userId={userId} />} />
      <Route path="/batch-management" element={<BatchManagementPage batches={data.batches} db={db} userId={userId} />} />
      <Route path="/medication-log" element={<MedicationLogPage data={data} db={db} userId={userId} />} />
      <Route path="/inventory" element={<InventoryManagementPage data={data} db={db} userId={userId} />} />
      <Route path="/health-monitoring" element={<HealthMonitoringPage data={data} />} />
      <Route path="/expense-profit" element={<ExpenseProfitTrackingPage data={data} db={db} userId={userId} />} />
      <Route path="/sales-distribution" element={<SalesDistributionPage data={data} db={db} userId={userId} />} />
      <Route path="/analytics" element={<AnalyticsDashboardPage data={data} />} />
      <Route path="/reports" element={<ReportsPage data={data} />} />
      <Route path="/notifications" element={<NotificationsAlertsPage data={data} db={db} userId={userId} />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;