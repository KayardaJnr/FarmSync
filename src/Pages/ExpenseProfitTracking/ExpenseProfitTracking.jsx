import React, { useState } from 'react';
import { collection, doc, addDoc, setDoc, increment } from 'firebase/firestore';
import { Plus, TrendingDown, TrendingUp, DollarSign, Filter } from 'lucide-react';
import StatCard from '../../components/common/StatCard/StatCard';
import DataTable from '../../components/common/DataTable/DataTable';
import Modal from '../../components/common/Modal/Modal';
import IconInput from '../../components/common/IconInput/IconInput';
import DatePicker from '../../components/common/DatePicker/DatePicker';
import FormMessage from '../../components/common/FormMessage/FormMessage';
import styles from './ExpenseProfitTracking.module.css';

const ExpenseProfitTrackingPage = ({ data, db, userId }) => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [newExpense, setNewExpense] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    category: '', 
    amount: 0 
  });

  const totalExpenses = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSales = data.sales.reduce((acc, curr) => acc + curr.amount, 0);
  const profit = totalSales - totalExpenses;
 
  const handleSaveExpense = async () => {
    if (!db || !userId || !newExpense.category || !newExpense.amount || Number(newExpense.amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid category and amount.' });
      return;
    }
   
    try {
      const { collection, doc, addDoc, setDoc, increment } = await import('firebase/firestore');
      const appId = 'farmsync-app';
      
      const expCol = collection(db, `artifacts/${appId}/users/${userId}/expenses`);
      await addDoc(expCol, {
        ...newExpense,
        amount: Number(newExpense.amount),
        date: new Date(newExpense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      });
     
      const statsDocRef = doc(db, `artifacts/${appId}/users/${userId}/farm/stats`);
      await setDoc(statsDocRef, {
        totalExpenses: increment(Number(newExpense.amount))
      }, { merge: true });

      setShowExpenseModal(false);
      setNewExpense({ date: new Date().toISOString().split('T')[0], category: '', amount: 0 });
      setMessage(null);
    } catch (error) {
      console.error("Error saving expense: ", error);
      setMessage({ type: 'error', text: 'Failed to save expense.' });
    }
  };
 
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Expense & Profit Tracking</h1>
     
      <div className={styles.statsRow}>
        <StatCard title="Total Expenses" value={`₦${totalExpenses.toLocaleString()}`} icon={TrendingDown} color="red" />
        <StatCard title="Total Sales" value={`₦${totalSales.toLocaleString()}`} icon={TrendingUp} color="green" />
        <StatCard title="Net Profit" value={`₦${profit.toLocaleString()}`} icon={DollarSign} color={profit > 0 ? 'blue' : 'red'} />
      </div>
     
      <div className={styles.tablesGrid}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Recent Expenses</h2>
            <button onClick={() => { setMessage(null); setShowExpenseModal(true); }} className={styles.addButton}>
              <Plus size={16} /> Add
            </button>
          </div>
          <DataTable 
            columns={['Date', 'Category', 'Amount']} 
            data={data.expenses.slice(0, 5).map(e => ({...e, amount: `₦${e.amount.toLocaleString()}`}))} 
          />
        </div>
        
        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>Recent Sales</h2>
          <DataTable 
            columns={['Date', 'Item', 'Amount']} 
            data={data.sales.slice(0, 5).map(s => ({...s, amount: `₦${s.amount.toLocaleString()}`}))} 
          />
        </div>
      </div>

      {showExpenseModal && (
        <Modal title="Log New Expense" onClose={() => setShowExpenseModal(false)}>
          <FormMessage message={message} />
          <div className={styles.modalForm}>
            <DatePicker 
              value={newExpense.date}
              onSelect={(date) => setNewExpense({...newExpense, date: date.toISOString().split('T')[0]})}
            />
            <IconInput 
              icon={Filter} 
              placeholder="Category (e.g., Feed, Labor)" 
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            />
            <IconInput 
              icon={DollarSign} 
              type="number"
              placeholder="Amount (e.g., 50000)" 
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
            />
            <button onClick={handleSaveExpense} className={styles.saveButton}>
              Save Expense
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExpenseProfitTrackingPage;