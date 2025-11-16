import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, PlusCircle, Package, Pill, Warehouse, HeartPulse, DollarSign, ShoppingCart, BarChart3, Bell } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, collection, query } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import MainLayout from "./layouts/MainLayout.jsx";
import LoginPage from './pages/Login/Login';
import AppRoutes from './routes/AppRoutes';
import { INITIAL_DATA } from './utils/constants';
import styles from './App.module.css';

const APP_ID = 'farmsync-app';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState(INITIAL_DATA);

const menuItems = [
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
];
  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
      setData(INITIAL_DATA);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading FarmSync...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage auth={auth} db={db} />;
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
         <Route path="/*" element={<AppRoutes data={data} db={db} userId={user.uid} />} />
       </Route>
    </Routes>
  );
}

export default App;