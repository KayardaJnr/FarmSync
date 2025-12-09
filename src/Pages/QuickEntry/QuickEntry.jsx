import React, { useState } from 'react';
import { Droplet, Package, HeartPulse, X, Skull, Save, Clock } from 'lucide-react';
import IconInput from '../../components/common/IconInput/IconInput';
import FormMessage from '../../components/common/FormMessage/FormMessage';
import { collection, doc, addDoc, setDoc, increment } from 'firebase/firestore';
import styles from './QuickEntry.module.css';

const QuickEntryPage = ({ data, db, userId }) => {
  const [selectedBatch, setSelectedBatch] = useState(data.batches.length > 0 ? data.batches[0].id : '');
  const [record, setRecord] = useState({ eggs: 0, feed: 0, sick: 0, mortality: 0 });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!db || !userId || isLoading) return;

    // Validate that a batch is selected
    if (!selectedBatch) {
      setMessage({ type: 'error', text: 'Please select a batch first.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Saving record...' });

    try {
      const appId = 'farmsync-app';

      // 1. Add a daily record for the specific batch
      const dailyRecordCol = collection(db, `artifacts/${appId}/users/${userId}/daily_records`);
      await addDoc(dailyRecordCol, {
        batchId: selectedBatch,
        date: new Date().toISOString(),
        crates: Number(record.eggs),
        bags: Number(record.feed),
        sick: Number(record.sick),
        mortality: Number(record.mortality),
        timestamp: Date.now()
      });

      // 2. Update the global daily summary document
      const summaryDocRef = doc(db, `artifacts/${appId}/users/${userId}/farm/dailySummary`);
      await setDoc(summaryDocRef, {
        eggs: increment(Number(record.eggs)),
        feed: increment(Number(record.feed)),
        sick: increment(Number(record.sick)),
        mortality: increment(Number(record.mortality)),
      }, { merge: true });

      // 3. Update main stats
      const statsDocRef = doc(db, `artifacts/${appId}/users/${userId}/farm/stats`);
      await setDoc(statsDocRef, {
        sick: increment(Number(record.sick)),
        mortality: increment(Number(record.mortality))
      }, { merge: true });
     
      // Success message
      setMessage({ type: 'success', text: 'Record saved successfully!' });
      
      // Reset form
      setRecord({ eggs: 0, feed: 0, sick: 0, mortality: 0 });

    } catch (error) {
      console.error("Error saving record: ", error);
      setMessage({ type: 'error', text: `Failed to save record: ${error.message}` });
    } finally {
      setIsLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };
 
  const inputs = [
    { key: 'eggs', icon: Droplet, label: 'Crates (Eggs)' },
    { key: 'feed', icon: Package, label: 'Bags (Feed)' },
    { key: 'sick', icon: HeartPulse, label: 'Sick Birds' },
    { key: 'mortality', icon: Skull, label: 'Mortality' }
  ];

  // Check if there are any active batches
  const activeBatches = data.batches.filter(b => b.status === 'active');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quick Entry</h1>
      
      {/* Today's Summary */}
      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Today's Total Summary</h3>
        <div className={styles.summaryGrid}>
          {Object.entries(data.dailySummary).map(([key, val]) => (
            <div key={key} className={styles.summaryCard}>
              <div className={styles.summaryLabel}>
                {key === 'eggs' ? 'Crates' : key === 'feed' ? 'Bags' : key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
              <div className={styles.summaryValue}>{val || 0}</div>
            </div>
          ))}
        </div>
      </div>
     
      {/* Record Form */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Record Production for Batch</h2>
       
        <FormMessage message={message} />

        {activeBatches.length === 0 ? (
          <div className={styles.noBatches}>
            <p>No active batches found. Please create a batch first in Batch Management.</p>
          </div>
        ) : (
          <>
            <div className={styles.batchSelector}>
              <label className={styles.label}>Select Batch</label>
              <div className={styles.batchButtons}>
                {activeBatches.map(batch => (
                  <button 
                    key={batch.id} 
                    type="button"
                    onClick={() => setSelectedBatch(batch.id)}
                    className={`${styles.batchButton} ${selectedBatch === batch.id ? styles.active : ''}`}
                    disabled={isLoading}
                  >
                    {batch.id}
                  </button>
                ))}
              </div>
            </div>
           
            <div className={styles.inputGrid}>
              {inputs.map(item => (
                <div key={item.key}>
                  <label className={styles.label}>{item.label}</label>
                  <IconInput
                    icon={item.icon}
                    type="number"
                    min="0"
                    value={record[item.key]}
                    onChange={(e) => setRecord({ ...record, [item.key]: parseInt(e.target.value) || 0 })}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
           
            <button 
              onClick={handleSave} 
              disabled={isLoading || !selectedBatch} 
              className={styles.saveButton}
            >
              {isLoading ? (
                <>
                  <Clock size={18} className={styles.spin} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Record
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickEntryPage;