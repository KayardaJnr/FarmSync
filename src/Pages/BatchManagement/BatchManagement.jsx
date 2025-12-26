import React, { useState } from 'react';
import { doc, setDoc, increment } from 'firebase/firestore';
import { PlusCircle, Search, Activity, Bird, HeartPulse, X, ShieldCheck, Scaling, Info } from 'lucide-react';
import StatCard from '../../components/common/StatCard/StatCard';
import Modal from '../../components/common/Modal/Modal';
import IconInput from '../../components/common/IconInput/IconInput';
import DatePicker from '../../components/common/DatePicker/DatePicker';
import FormMessage from '../../components/common/FormMessage/FormMessage';
import styles from './BatchManagement.module.css';

const BatchManagementPage = ({ batches, setActiveNav, db, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [newBatch, setNewBatch] = useState({
    id: '',
    breed: '',
    quantity: 0,
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleSaveBatch = async () => {
    if (!db || !userId || !newBatch.id || !newBatch.breed) {
      setMessage({ type: 'error', text: 'Please fill out Batch ID and Breed.'});
      return;
    }
   
    try {
      const { doc, setDoc, increment } = await import('firebase/firestore');
      const appId = 'farmsync-app';
      
      const batchDocRef = doc(db, `artifacts/${appId}/users/${userId}/batches`, newBatch.id);
     
      await setDoc(batchDocRef, {
        ...newBatch,
        quantity: Number(newBatch.quantity),
        age: '1 day',
        status: 'active',
        mortality: 0,
        health: 'Excellent',
        avgWeight: '0.1',
        progress: 1,
      });

      const statsDocRef = doc(db, `artifacts/${appId}/users/${userId}/farm/stats`);
      await setDoc(statsDocRef, {
        totalBirds: increment(Number(newBatch.quantity))
      }, { merge: true });
     
      setShowModal(false);
      setNewBatch({ id: '', breed: '', quantity: 0, startDate: new Date().toISOString().split('T')[0] });
      setMessage(null);
    } catch (error) {
      console.error("Error adding batch: ", error);
      setMessage({ type: 'error', text: 'Failed to add batch. Does this ID already exist?' });
    }
  };
 
  const BatchCard = ({ batch }) => (
    <div className={styles.batchCard}>
      <div className={styles.batchHeader}>
        <div className={styles.batchInfo}>
          <div className={styles.batchIcon}>{batch.id}</div>
          <div>
            <h3 className={styles.batchBreed}>{batch.breed}</h3>
            <p className={styles.batchDate}>
              {new Date(batch.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {batch.age}
            </p>
          </div>
        </div>
        <span className={`${styles.status} ${batch.status === 'active' ? styles.active : styles.inactive}`}>
          {batch.status}
        </span>
      </div>
     
      <div className={styles.statsGrid}>
        {[
          { label: 'Quantity', value: batch.quantity.toLocaleString(), icon: Bird, color: 'blue' },
          { label: 'Mortality', value: batch.mortality, icon: X, color: 'red' },
          { label: 'Health', value: batch.health, icon: ShieldCheck, color: 'green' },
          { label: 'Avg Weight', value: `${batch.avgWeight} kg`, icon: Scaling, color: 'yellow' }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`${styles.stat} ${styles[item.color]}`}>
              <div className={styles.statHeader}>
                <Icon size={16} />
                <div className={styles.statLabel}>{item.label}</div>
              </div>
              <div className={styles.statValue}>{item.value}</div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${batch.progress}%` }}></div>
        </div>
        <p className={styles.progressText}>{batch.progress}% to Maturity</p>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Batch Management</h1>
        <button onClick={() => setShowModal(true)} className={styles.addButton}>
          <PlusCircle size={18} />
          Add New Batch
        </button>
      </div>
     
      <div className={styles.statsRow}>
        <StatCard title="Total Batches" value={batches.length} icon={Search} small />
        <StatCard title="Active Batches" value={batches.filter(b => b.status === 'active').length} icon={Activity} small />
        <StatCard title="Total Birds" value={batches.reduce((acc, b) => acc + b.quantity, 0).toLocaleString()} icon={Bird} small />
        <StatCard title="Total Mortality" value={batches.reduce((acc, b) => acc + b.mortality, 0).toLocaleString()} icon={HeartPulse} small />
      </div>
     
      <div className={styles.batchList}>
        {batches.map(batch => (
          <BatchCard key={batch.id} batch={batch} />
        ))}
        {batches.length === 0 && (
          <p className={styles.emptyText}>No batches found. Add a new batch to get started.</p>
        )}
      </div>

      {showModal && (
        <Modal title="Add New Batch" onClose={() => setShowModal(false)}>
          <FormMessage message={message} />
          <div className={styles.modalForm}>
            <IconInput 
              icon={Info} 
              placeholder="Batch ID (e.g., L005)" 
              value={newBatch.id}
              onChange={(e) => setNewBatch({...newBatch, id: e.target.value.toUpperCase()})}
            />
            <IconInput 
              icon={Bird} 
              placeholder="Breed (e.g., Rhode Island Red)" 
              value={newBatch.breed}
              onChange={(e) => setNewBatch({...newBatch, breed: e.target.value})}
            />
            <IconInput 
              icon={Activity} 
              type="number" 
              placeholder="Initial Quantity" 
              value={newBatch.quantity}
              onChange={(e) => setNewBatch({...newBatch, quantity: e.target.value})}
            />
            <DatePicker 
              value={newBatch.startDate}
              onSelect={(date) => setNewBatch({...newBatch, startDate: date.toISOString().split('T')[0]})}
            />
            <button onClick={handleSaveBatch} className={styles.saveButton}>
              Save Batch
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BatchManagementPage;