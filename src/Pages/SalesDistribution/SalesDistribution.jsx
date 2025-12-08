import React, { useState } from 'react';
import { Plus, DollarSign, Droplet, Bird, FileText, Package, Info, User } from 'lucide-react';
import StatCard from '../../components/common/StatCard/StatCard';
import DataTable from '../../components/common/DataTable/DataTable';
import Modal from '../../components/common/Modal/Modal';
import IconInput from '../../components/common/IconInput/IconInput';
import DatePicker from '../../components/common/DatePicker/DatePicker';
import FormMessage from '../../components/common/FormMessage/FormMessage';
import styles from './SalesDistribution.module.css';

const SalesDistributionPage = ({ data, db, userId }) => {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [newSale, setNewSale] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    invoice_id: '', 
    item: '', 
    quantity: 0, 
    amount: 0, 
    customer: '' 
  });

  const handleSaveSale = async () => {
    if (!db || !userId || !newSale.item || !newSale.amount || Number(newSale.amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid item and amount.' });
      return;
    }
   
    try {
      const { collection, doc, addDoc, setDoc, increment } = await import('firebase/firestore');
      const appId = 'farmsync-app';
      
      const salesCol = collection(db, `artifacts/${appId}/users/${userId}/sales`);
      await addDoc(salesCol, {
        ...newSale,
        amount: Number(newSale.amount),
        quantity: Number(newSale.quantity),
        date: new Date(newSale.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      });

      const statsDocRef = doc(db, `artifacts/${appId}/users/${userId}/farm/stats`);
      await setDoc(statsDocRef, {
        totalSales: increment(Number(newSale.amount))
      }, { merge: true });

      setShowSaleModal(false);
      setNewSale({ date: new Date().toISOString().split('T')[0], invoice_id: '', item: '', quantity: 0, amount: 0, customer: '' });
      setMessage(null);
    } catch (error) {
      console.error("Error saving sale: ", error);
      setMessage({ type: 'error', text: 'Failed to save sale.' });
    }
  };

  const totalSales = data.sales.reduce((acc, curr) => acc + curr.amount, 0);
  const eggsSold = data.sales.filter(s => s.item.toLowerCase().includes('egg')).reduce((acc, s) => acc + s.quantity, 0);
  const birdsSold = data.sales.filter(s => s.item.toLowerCase().includes('feed') || s.item.toLowerCase().includes('bag')).reduce((acc, s) => acc + s.quantity, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sales & Distribution</h1>
        <button onClick={() => { setMessage(null); setShowSaleModal(true); }} className={styles.addButton}>
          <Plus size={18} />
          Add Sale
        </button>
      </div>
     
      <div className={styles.statsRow}>
        <StatCard title="Total Sales" value={`₦${totalSales.toLocaleString()}`} icon={DollarSign} color="green" />
        <StatCard title="Eggs Sold (Crates)" value={eggsSold.toLocaleString()} icon={Droplet} color="yellow" />
        <StatCard title="Feed Sold (Bags)" value={birdsSold.toLocaleString()} icon={Package} color="blue" />
      </div>
     
      <DataTable 
        columns={['Date', 'Invoice ID', 'Item', 'Quantity', 'Amount', 'Customer']}
        data={data.sales.map(s => ({
          ...s, 
          amount: `₦${s.amount.toLocaleString()}`
        }))}
      />

      {showSaleModal && (
        <Modal title="Log New Sale" onClose={() => setShowSaleModal(false)}>
          <FormMessage message={message} />
          <div className={styles.modalForm}>
            <DatePicker 
              value={newSale.date}
              onSelect={(date) => setNewSale({...newSale, date: date.toISOString().split('T')[0]})}
            />
            <IconInput 
              icon={FileText} 
              placeholder="Invoice ID (optional)" 
              value={newSale.invoice_id}
              onChange={(e) => setNewSale({...newSale, invoice_id: e.target.value})}
            />
            <IconInput 
              icon={Package} 
              placeholder="Item (e.g., Eggs, Broilers)" 
              value={newSale.item}
              onChange={(e) => setNewSale({...newSale, item: e.target.value})}
            />
            <IconInput 
              icon={Info} 
              type="number"
              placeholder="Quantity (e.g., 30)" 
              value={newSale.quantity}
              onChange={(e) => setNewSale({...newSale, quantity: Number(e.target.value)})}
            />
            <IconInput 
              icon={DollarSign} 
              type="number"
              placeholder="Total Amount (e.g., 50000)" 
              value={newSale.amount}
              onChange={(e) => setNewSale({...newSale, amount: Number(e.target.value)})}
            />
            <IconInput 
              icon={User} 
              placeholder="Customer Name" 
              value={newSale.customer}
              onChange={(e) => setNewSale({...newSale, customer: e.target.value})}
            />
            <button onClick={handleSaveSale} className={styles.saveButton}>
              Save Sale
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SalesDistributionPage;