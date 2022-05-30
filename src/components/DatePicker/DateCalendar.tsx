import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './dateCalendar.module.scss';

const DateCalendar = () => {
  const [value, onChange] = useState(new Date());

  return (
    <div className={styles.datePicker}>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default DateCalendar;
