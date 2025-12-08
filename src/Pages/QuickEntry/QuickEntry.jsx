// src/pages/QuickEntry/QuickEntryPage.jsx
import React, { useState, useEffect } from 'react';
import { Droplet, Package, HeartPulse, X, Save, Clock } from 'lucide-react';
import IconInput from '../../components/common/IconInput/IconInput';
import FormMessage from '../../components/common/FormMessage/FormMessage';
import { collection, doc, addDoc, setDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './QuickEntry.module.css';

const QuickEntryPage = ({ data, userId }) => {
  const [selectedBatch, setSelectedBatch] = useState(data?.batches?.[0]?.id || '');
  const [record, setRecord] = useState({ eggs: 0, feed: 0, sick: 0, mortality: 0 });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dailySummary, setDailySummary] = useState({ eggs: 0, feed: 0, sick: 0, mortality: 0 });

  // ===== Real-time listener for dailySummary =====
  useEffect(() => {
    if (!userId) return;
    const summaryDocRef = doc(db, `artifacts/farmsync-app/users/${userId}/farm/dailySummary`);

    const unsubscribe = onSnapshot(summaryDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setDailySummary(docSnap.data());
      } else {
        // Create the document if it doesn't exist
        setDoc(summaryDocRef, { eggs: 0, feed: 0, sick: 0, mortality: 0 }, { merge: true });
        setDailySummary({ eggs: 0, feed: 0, sick: 0, mortality: 0 });
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // ===== Handle Save =====
  const handleSave = async () => {
    if (!userId || isLoading) return;
    if (!selectedBatch) {
      setMessage({ type: 'error', text: 'Please select a batch first.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Saving record...' });

    try {
      const appId = 'farmsync-app';

      // Add daily record
      const dailyRecordCol = collection(db, `artifacts/${appId}/users/${userId}/daily_records`);
      await addDoc(dailyRecordCol, {
        batchId: selectedBatch,
        date: new Date().toISOString(),
        crates: Number(record.eggs) || 0,
        bags: Number(record.feed) || 0,
        sick: Number(record.sick) || 0,
        mortality: Number(record.mortality) || 0,
        timestamp: Date.now()
      });

      // Update daily summary
      const summaryDocRef = doc(db, `artifacts/${appId}/users/${userId}/farm/dailySummary`);
      await setDoc(summaryDocRef, {
        eggs: increment(Number(record.eggs) || 0),
        feed: increment(Number(record.feed) || 0),
        sick: increment(Number(record.sick) || 0),
        mortality: increment(Number(record.mortality) || 0),
      }, { merge: true });

      // Update farm stats
      const statsDocRef = doc(db, `artifacts/${appId}/users/${userId}/farm/stats`);
      await setDoc(statsDocRef, {
        sick: increment(Number(record.sick) || 0),
        mortality: increment(Number(record.mortality) || 0)
      }, { merge: true });

      // Reset form & show success
      setMessage({ type: 'success', text: 'Record saved successfully!' });
      setRecord({ eggs: 0, feed: 0, sick: 0, mortality: 0 });
    } catch (error) {
      console.error('Error saving record:', error);
      setMessage({ type: 'error', text: `Failed to save record: ${error.message}` });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const inputs = [
    { key: 'eggs', icon: Droplet, label: 'Crates (Eggs)' },
    { key: 'feed', icon: Package, label: 'Bags (Feed)' },
    { key: 'sick', icon: HeartPulse, label: 'Sick Birds' },
    { key: 'mortality', icon: X, label: 'Mortality' }
  ];

  const activeBatches = data?.batches?.filter(b => b.status === 'active') || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quick Entry</h1>

      {/* Daily Summary Cards */}
      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Today's Total Summary</h3>
        <div className={styles.summaryGrid}>
          {Object.entries(dailySummary).map(([key, val]) => (
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
            <p>No active batches found. Please create a batch first.</p>
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
