import React, { useState } from 'react';
import { Plus, Pill, Calendar, Activity, Search, Droplet, Info } from 'lucide-react';
import StatCard from '../../components/common/StatCard/StatCard';
import DataTable from '../../components/common/DataTable/DataTable';
import Modal from '../../components/common/Modal/Modal';
import IconInput from '../../components/common/IconInput/IconInput';
import DatePicker from '../../components/common/DatePicker/DatePicker';
import FormMessage from '../../components/common/FormMessage/FormMessage';
import styles from './MedicationLog.module.css';

const MedicationLogPage = ({ data, db, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    batch_id: '',
    medication: '',
    dosage: '',
    reason: ''
  });

  const handleSaveLog = async () => {
    if (!db || !userId || !newLog.batch_id || !newLog.medication) {
       setMessage({ type: 'error', text: 'Please fill out Batch ID and Medication.' });
       return;
    }
   
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const appId = 'farmsync-app';
      
      const logCol = collection(db, `artifacts/${appId}/users/${userId}/logs`);
      await addDoc(logCol, {
        ...newLog,
        date: new Date(newLog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      });
     
      setShowModal(false);
      setNewLog({ date: new Date().toISOString().split('T')[0], batch_id: '', medication: '', dosage: '', reason: '' });
      setMessage(null);
    } catch (error) {
      console.error("Error adding log: ", error);
      setMessage({ type: 'error', text: 'Failed to add log.' });
    }
  };
 
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Medication Log</h1>
        <button onClick={() => { setMessage(null); setShowModal(true); }} className={styles.addButton}>
          <Plus size={18} />
          Log Medication
        </button>
      </div>
     
      <div className={styles.statsRow}>
        <StatCard title="Total Logs" value={data.logs.length} icon={Pill} color="blue" />
        <StatCard title="Upcoming Vaccinations" value="0" icon={Calendar} color="yellow" />
        <StatCard title="Active Treatments" value="0" icon={Activity} color="purple" />
      </div>
     
      <DataTable 
        columns={['Date', 'Batch ID', 'Medication', 'Dosage', 'Reason']}
        data={data.logs}
      />
     
      {showModal && (
        <Modal title="Log New Medication" onClose={() => setShowModal(false)}>
          <FormMessage message={message} />
          <div className={styles.modalForm}>
            <DatePicker 
              value={newLog.date}
              onSelect={(date) => setNewLog({...newLog, date: date.toISOString().split('T')[0]})}
            />
            <IconInput 
              icon={Search} 
              placeholder="Batch ID (e.g., L001)" 
              value={newLog.batch_id}
              onChange={(e) => setNewLog({...newLog, batch_id: e.target.value})}
            />
            <IconInput 
              icon={Pill} 
              placeholder="Medication Name" 
              value={newLog.medication}
              onChange={(e) => setNewLog({...newLog, medication: e.target.value})}
            />
            <IconInput 
              icon={Droplet} 
              placeholder="Dosage (e.g., 100ml)" 
              value={newLog.dosage}
              onChange={(e) => setNewLog({...newLog, dosage: e.target.value})}
            />
            <IconInput 
              icon={Info} 
              placeholder="Reason for Treatment" 
              value={newLog.reason}
              onChange={(e) => setNewLog({...newLog, reason: e.target.value})}
            />
            <button onClick={handleSaveLog} className={styles.saveButton}>
              Save Log
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MedicationLogPage;