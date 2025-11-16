import React from 'react';
import styles from './DataTable.module.css';

const DataTable = ({ columns, data }) => (
  <div className={styles.container}>
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          {columns.map((col) => (
            <th key={col} className={styles.headerCell}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={row.id || rowIndex} className={styles.bodyRow}>
            {columns.map((col, colIndex) => (
              <td key={colIndex} className={styles.bodyCell}>
                {row[col.toLowerCase().replace(/ /g, '_')] || row[col.toLowerCase()] || 'N/A'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;