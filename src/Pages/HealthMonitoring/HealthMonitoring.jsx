import React from 'react';
import { ShieldCheck, HeartPulse, TrendingDown } from 'lucide-react';
import StatCard from '../../components/common/StatCard/StatCard';
import styles from './HealthMonitoring.module.css';

const HealthMonitoringPage = ({ data }) => (
  <div className={styles.container}>
    <h1 className={styles.title}>Health Monitoring</h1>
   
    <div className={styles.statsRow}>
      <StatCard title="Overall Health" value="Good" icon={ShieldCheck} color="green" />
      <StatCard title="Active Sickness" value={`${data.dailySummary.sick} Birds`} icon={HeartPulse} color="red" />
      <StatCard title="Avg. Mortality Rate" value="0%" icon={TrendingDown} color="blue" />
    </div>
   
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Batch Health Overview</h2>
      <div className={styles.batchList}>
        {data.batches.map(batch => (
          <div key={batch.id} className={styles.batchItem}>
            <div>
              <span className={styles.batchId}>{batch.id}</span>
              <span className={styles.batchBreed}>({batch.breed})</span>
            </div>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Health</div>
                <div className={`${styles.statValue} ${batch.health === 'Excellent' ? styles.excellent : styles.good}`}>
                  {batch.health}
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Mortality</div>
                <div className={styles.statValue}>{batch.mortality}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Avg. Weight</div>
                <div className={styles.statValue}>{batch.avgWeight} kg</div>
              </div>
            </div>
            <button className={styles.detailsButton}>View Details</button>
          </div>
        ))}
        {data.batches.length === 0 && (
          <p className={styles.emptyText}>No batches found.</p>
        )}
      </div>
    </div>
  </div>
);

export default HealthMonitoringPage;