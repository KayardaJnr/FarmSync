import React, { useState } from 'react';
import { Droplet, Package, HeartPulse, X, Save, Clock } from 'lucide-react';
import IconInput from '../../components/common/IconInput/IconInput';
import FormMessage from '../../components/common/FormMessage/FormMessage';
import styles from './QuickEntry.module.css';

const QuickEntryPage = ({ data, db, userId }) => {
  const [selectedBatch, setSelectedBatch] = useState('L001');
  const [record, setRecord] = useState({ eggs: 0, feed: 0, sick: 0, mortality: 0 });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!db || !userId || isLoading) return;

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Saving record...' });

    try {
      const { collection, doc, addDoc, setDoc, increment } = await import('firebase/firestore');
      const appId = 'farmsync-app';

      // Add daily record
      const dailyRecordCol = collection(db, `artifacts/${appId}/users/${userId}/daily_records`);
      await addDoc(dailyRecordCol, {
        batchId: selectedBatch,
        date: new Date().toISOString(),
        crates: record.eggs,
        bags: record.feed,
        sick: record.sick,
        mortality: record.mortality,
      });

      // Update daily summary
      const summaryDocRef = doc(db, `artifacts/${appId}/users/${userId}/farm/dailySummary`);
      await setDoc(summaryDocRef, {
        eggs: increment(record.eggs),
        feed: increment(record.feed),
        sick: increment(record.sick),
        mortality: increment(record.mortality),
      }, { merge: true });

      // Update stats
      const statsDocRef = doc(db, `artifacts/${appId}/users/${userId}/farm/stats`);
      await setDoc(statsDocRef, {
        sick: increment(record.sick),
        mortality: increment(record.mortality)
      }, { merge: true });

      setMessage({ type: 'success', text: 'Record saved successfully!' });
      setRecord({ eggs: 0, feed: 0, sick: 0, mortality: 0 });

    } catch (error) {
      console.error("Error saving record: ", error);
      setMessage({ type: 'error', text: 'Failed to save record.' });
    }
   
    setIsLoading(false);
    setTimeout(() => setMessage(null), 5000);
  };
 
  const inputs = [
    { key: 'eggs', icon: Droplet, label: 'Crates' },
    { key: 'feed', icon: Package, label: 'Bags' },
    { key: 'sick', icon: HeartPulse, label: 'Sick' },
    { key: 'mortality', icon: X, label: 'Mortality' }
  ];

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
              <div className={styles.summaryValue}>{val}</div>
            </div>
          ))}
        </div>
      </div>
     
      {/* Record Form */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Record Production for Batch</h2>
       
        <FormMessage message={message} />

        <div className={styles.batchSelector}>
          <label className={styles.label}>Select Batch</label>
          <div className={styles.batchButtons}>
            {data.batches.filter(b => b.status === 'active').map(batch => (
              <button 
                key={batch.id} 
                onClick={() => setSelectedBatch(batch.id)}
                className={`${styles.batchButton} ${selectedBatch === batch.id ? styles.active : ''}`}
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
                value={record[item.key]}
                onChange={(e) => setRecord({ ...record, [item.key]: parseInt(e.target.value) || 0 })}
                disabled={isLoading}
              />
            </div>
          ))}
        </div>
       
        <button 
          onClick={handleSave} 
          disabled={isLoading} 
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
      </div>
    </div>
  );
};

export default QuickEntryPage;