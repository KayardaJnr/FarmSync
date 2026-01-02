import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Package, Pill, Warehouse, HeartPulse, DollarSign, ShoppingCart, BarChart3, Bell, FileText } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import MainLayout from "./layouts/MainLayout";
import LandingPage from './Pages/Landing/Landing';
import LoginPage from './Pages/Login/Login';
import AppRoutes from './routes/AppRoutes';
// Default app data shape used until Firestore snapshots populate real values
const DEFAULT_DATA = {
  stats: {
    totalBirds: 0,
    sales: 0,
    sick: 0,
    mortality: 0,
    totalExpenses: 0,
    totalSales: 0,
  },
  dailySummary: {
    eggs: 0,
    feed: 0,
    sick: 0,
    mortality: 0,
  },
  batches: [],
  inventory: [],
  logs: [],
  expenses: [],
  sales: [],
  notifications: [],
};
import styles from './App.module.css';

const APP_ID = 'farmsync-app';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [data, setData] = useState(DEFAULT_DATA);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

const menuItems = useMemo(() => [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Quick Entry', icon: PlusCircle, path: '/quick-entry' },
  { label: 'Batch Management', icon: Package, path: '/batch-management' },
  { label: 'Medication Log', icon: Pill, path: '/medication-log' },
  { label: 'Inventory Management', icon: Warehouse, path: '/inventory' },
  { label: 'Health Monitoring', icon: HeartPulse, path: '/health-monitoring' },
  { label: 'Expense & Profit', icon: DollarSign, path: '/expense-profit' },
  { label: 'Sales & Distribution', icon: ShoppingCart, path: '/sales-distribution' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Reports', icon: FileText, path: '/reports' }, 
  { label: 'Notifications', icon: Bell, path: '/notifications' },
], []);
  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // detect first-time login (previously null -> now user)
      // const wasLoggedOut = !user;
      setUser(currentUser);
      setLoading(false);

    //   try {
    //     // Only redirect on initial automatic login and on certain paths
    //     if (currentUser && wasLoggedOut) {
    //       const path = window.location.pathname;
    //       if (path === '/' || path === '/login' || path === '/notifications') {
    //         // use global history to navigate to dashboard
    //         window.history.replaceState({}, '', '/dashboard');
    //         // also trigger react-router navigation if available
    //         if (navigateRef.current) navigateRef.current('/dashboard', { replace: true });
    //       }
    //     }
    //   } catch {
    //     // ignore navigation errors
    //   }
    // });

    return () => unsubscribe();
  }, [user]);

  // Firestore listeners
  useEffect(() => {
    if (!user) return;

    const unsubscribers = [];

    // Stats
    const statsRef = doc(db, `artifacts/${APP_ID}/users/${user.uid}/farm/stats`);
    unsubscribers.push(
      onSnapshot(statsRef, (doc) => {
        if (doc.exists()) {
          setData((prev) => ({ ...prev, stats: { ...prev.stats, ...doc.data() } }));
        }
      })
    );

    // Daily summary
    const summaryRef = doc(db, `artifacts/${APP_ID}/users/${user.uid}/farm/dailySummary`);
    unsubscribers.push(
      onSnapshot(summaryRef, (doc) => {
        if (doc.exists()) {
          setData((prev) => ({ ...prev, dailySummary: { ...prev.dailySummary, ...doc.data() } }));
        }
      })
    );

    // Aggregate today's daily_records as a fallback/real-time source of truth
    try {
      const recordsCol = collection(db, `artifacts/${APP_ID}/users/${user.uid}/daily_records`);
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const recordsQuery = query(recordsCol, where('timestamp', '>=', start.getTime()), where('timestamp', '<=', end.getTime()));
      unsubscribers.push(
        onSnapshot(recordsQuery, (snapshot) => {
          const totals = { eggs: 0, feed: 0, sick: 0, mortality: 0 };
          snapshot.docs.forEach((d) => {
            const docData = d.data() || {};
            totals.eggs += Number(docData.crates || 0);
            totals.feed += Number(docData.bags || 0);
            totals.sick += Number(docData.sick || 0);
            totals.mortality += Number(docData.mortality || 0);
          });
          setData((prev) => ({ ...prev, dailySummary: { ...prev.dailySummary, ...totals } }));
        })
      );
    } catch (e) {
      console.warn('Failed to set up daily_records listener', e);
    }

    // Batches
    const batchesRef = collection(db, `artifacts/${APP_ID}/users/${user.uid}/batches`);
    unsubscribers.push(
      onSnapshot(query(batchesRef), (snapshot) => {
        const batches = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData((prev) => ({ ...prev, batches }));
      })
    );

    // Inventory
    const inventoryRef = collection(db, `artifacts/${APP_ID}/users/${user.uid}/inventory`);
    unsubscribers.push(
      onSnapshot(query(inventoryRef), (snapshot) => {
        const inventory = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData((prev) => ({ ...prev, inventory }));
      })
    );

    // Logs
    const logsRef = collection(db, `artifacts/${APP_ID}/users/${user.uid}/logs`);
    unsubscribers.push(
      onSnapshot(query(logsRef), (snapshot) => {
        const logs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData((prev) => ({ ...prev, logs }));
      })
    );

    // Expenses
    const expensesRef = collection(db, `artifacts/${APP_ID}/users/${user.uid}/expenses`);
    unsubscribers.push(
      onSnapshot(query(expensesRef), (snapshot) => {
        const expenses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData((prev) => ({ ...prev, expenses }));
      })
    );

    // Sales
    const salesRef = collection(db, `artifacts/${APP_ID}/users/${user.uid}/sales`);
    unsubscribers.push(
      onSnapshot(query(salesRef), (snapshot) => {
        const sales = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData((prev) => ({ ...prev, sales }));
      })
    );

    // Notifications
    const notificationsRef = collection(db, `artifacts/${APP_ID}/users/${user.uid}/notifications`);
    unsubscribers.push(
      onSnapshot(query(notificationsRef), (snapshot) => {
        const notifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData((prev) => ({ ...prev, notifications }));
      })
    );

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setData(DEFAULT_DATA);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        {/* <p>Loading FarmSync...</p> */}
      </div>
    );
  }

if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  const unreadCount = data.notifications.filter((n) => !n.read).length;

  return (
    <Routes>
      <Route
          element={
        <MainLayout
           menuItems={menuItems}
           unreadCount={unreadCount}
           isCollapsed={isCollapsed}
           setIsCollapsed={setIsCollapsed}
           onLogout={handleLogout}
           user={user}  // Add this line
         />
       }
     >
         <Route path="/*" element={<AppRoutes data={data} db={db} userId={user.uid} updateDailySummary={(delta) => {
           // delta: { eggs, feed, sick, mortality }
           setData((prev) => ({
             ...prev,
             dailySummary: {
               eggs: (Number(prev.dailySummary.eggs) || 0) + (Number(delta.eggs) || 0),
               feed: (Number(prev.dailySummary.feed) || 0) + (Number(delta.feed) || 0),
               sick: (Number(prev.dailySummary.sick) || 0) + (Number(delta.sick) || 0),
               mortality: (Number(prev.dailySummary.mortality) || 0) + (Number(delta.mortality) || 0),
             }
           }));
         }} />} />
       </Route>
    </Routes>
  );
}

export default App;