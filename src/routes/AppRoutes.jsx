import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const DashboardPage = React.lazy(() => import('../Pages/Dashboard/Dashboard'));
const QuickEntryPage = React.lazy(() => import('../Pages/QuickEntry/QuickEntry'));
const BatchManagementPage = React.lazy(() => import('../Pages/BatchManagement/BatchManagement'));
const MedicationLogPage = React.lazy(() => import('../Pages/MedicationLog/MedicationLog'));
const InventoryManagementPage = React.lazy(() => import('../Pages/InventoryManagement/InventoryManagement'));
const HealthMonitoringPage = React.lazy(() => import('../Pages/HealthMonitoring/HealthMonitoring'));
const ExpenseProfitTrackingPage = React.lazy(() => import('../Pages/ExpenseProfitTracking/ExpenseProfitTracking'));
const SalesDistributionPage = React.lazy(() => import('../Pages/SalesDistribution/SalesDistribution'));
const AnalyticsDashboardPage = React.lazy(() => import('../Pages/AnalyticsDashboard/AnalyticsDashboard'));
const NotificationsAlertsPage = React.lazy(() => import('../Pages/NotificationsAlerts/NotificationsAlerts'));
const ReportsPage = React.lazy(() => import('../Pages/Reports/Reports'));
const ProfilePage = React.lazy(() => import('../Pages/Profile/Profile'));
const SettingsPage = React.lazy(() => import('../Pages/Settings/Settings'));

const AppRoutes = ({ data, db, userId }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
};

export default AppRoutes;