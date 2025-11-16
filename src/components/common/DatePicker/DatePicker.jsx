import React, { useState, useRef } from 'react';
import { Calendar } from 'lucide-react';
import useClickOutside from '../../../hooks/useClickOutside'; 
import styles from './DatePicker.module.css';

const SimpleCalendar = ({ selectedDate, setSelectedDate, setOpen }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());

  const days = [];
  let day = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    if (setOpen) setOpen(false);
  };

  const isSameDay = (d1, d2) => 
    d1 && d2 && 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();
    
  const isSameMonth = (d1, d2) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth();

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          className={styles.navButton}
          type="button"
        >
          &lt;
        </button>
        <div className={styles.monthYear}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          className={styles.navButton}
          type="button"
        >
          &gt;
        </button>
      </div>
      
      <div className={styles.weekdays}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className={styles.weekday}>{d}</div>
        ))}
      </div>
      
      <div className={styles.daysGrid}>
        {days.map((d, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelectDate(d)}
            className={`${styles.dayButton} 
              ${!isSameMonth(d, currentMonth) ? styles.otherMonth : ''} 
              ${isSameDay(d, new Date()) ? styles.today : ''} 
              ${selectedDate && isSameDay(d, selectedDate) ? styles.selected : ''}
            `}
          >
            {d.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

const DatePicker = ({ value, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  useClickOutside(popoverRef, () => setIsOpen(false));

  const handleSetDate = (newDate) => {
    if (onSelect) onSelect(newDate);
    setIsOpen(false);
  };

  const displayDate = value ? new Date(value) : null;

  return (
    <div className={styles.container} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.trigger}
      >
        <span className={displayDate ? styles.dateText : styles.placeholder}>
          {displayDate 
            ? displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
            : 'Pick a date'
          }
        </span>
        <Calendar size={18} className={styles.icon} />
      </button>
      
      {isOpen && (
        <div className={styles.popover}>
          <SimpleCalendar 
            selectedDate={displayDate} 
            setSelectedDate={handleSetDate} 
            setOpen={setIsOpen} 
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;