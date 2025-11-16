import React, { useState } from 'react';
import { Plus, Package, Pill, AlertTriangle, Filter, Gauge, Info } from 'lucide-react';
import StatCard from '../../components/common/StatCard/StatCard';
import DataTable from '../../components/common/DataTable/DataTable';
import Modal from '../../components/common/Modal/Modal';
import IconInput from '../../components/common/IconInput/IconInput';
import FormMessage from '../../components/common/FormMessage/FormMessage';
import styles from './InventoryManagement.module.css';

const InventoryManagementPage = ({ data, db, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [newItem, setNewItem] = useState({
    item: '',
    category: '',
    stock: 0,
    unit: '',
    low_stock_threshold: 0
  });

  const handleSaveItem = async () => {
    if (!db || !userId || !newItem.item || !newItem.category) {
       setMessage({ type: 'error', text: 'Please fill out Item and Category.' });
       return;
    }
   
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const appId = 'farmsync-app';
      
      const invCol = collection(db, `artifacts/${appId}/users/${userId}/inventory`);
      await addDoc(invCol, {
        ...newItem,
        stock: Number(newItem.stock),
        low_stock_threshold: Number(newItem.low_stock_threshold)
      });
     
      setShowModal(false);
      setNewItem({ item: '', category: '', stock: 0, unit: '', low_stock_threshold: 0 });
      setMessage(null);
    } catch (error) {
      console.error("Error adding item: ", error);
      setMessage({ type: 'error', text: 'Failed to add item.' });
    }
  };
 
  const lowStockCount = data.inventory.filter(i => i.stock < i.low_stock_threshold).length;
  const feedStock = data.inventory.find(i => i.item === 'Layer Feed');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inventory Management</h1>
        <button onClick={() => { setMessage(null); setShowModal(true); }} className={styles.addButton}>
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className={styles.statsRow}>
        <StatCard title="Feed Stock" value={`${feedStock ? feedStock.stock : 0} bags`} icon={Package} color="yellow" />
        <StatCard title="Medication Stock" value={`${data.inventory.filter(i => i.category === 'Medication').length} Types`} icon={Pill} color="blue" />
        <StatCard title="Items Low on Stock" value={lowStockCount} icon={AlertTriangle} color="red" />
      </div>
     
      <DataTable 
        columns={['Item', 'Category', 'Stock', 'Unit', 'Status']}
        data={data.inventory.map(i => ({
          ...i,
          stock: i.stock.toLocaleString(),
          status: i.stock < i.low_stock_threshold ? 
            <span className={styles.statusLow}>Low</span> : 
            <span className={styles.statusOk}>OK</span>
        }))}
      />
     
      {showModal && (
        <Modal title="Add New Inventory Item" onClose={() => setShowModal(false)}>
          <FormMessage message={message} />
          <div className={styles.modalForm}>
            <IconInput 
              icon={Package} 
              placeholder="Item Name" 
              value={newItem.item}
              onChange={(e) => setNewItem({...newItem, item: e.target.value})}
            />
            <IconInput 
              icon={Filter} 
              placeholder="Category (e.g., Feed, Medication)" 
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            />
            <IconInput 
              icon={Gauge} 
              type="number" 
              placeholder="Current Stock" 
              value={newItem.stock}
              onChange={(e) => setNewItem({...newItem, stock: Number(e.target.value)})}
            />
            <IconInput 
              icon={Info} 
              placeholder="Unit (e.g., bags, ml, doses)" 
              value={newItem.unit}
              onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
            />
            <IconInput 
              icon={AlertTriangle} 
              type="number" 
              placeholder="Low Stock Threshold" 
              value={newItem.low_stock_threshold}
              onChange={(e) => setNewItem({...newItem, low_stock_threshold: Number(e.target.value)})}
            />
            <button onClick={handleSaveItem} className={styles.saveButton}>
              Save Item
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InventoryManagementPage;