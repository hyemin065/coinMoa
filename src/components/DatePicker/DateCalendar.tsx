import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
import styles from './dateCalendar.module.scss';

const DateCalendar = () => {
  const [value, onChange] = useState(new Date());
  const [isShowCalendar, setIsShowCalendar] = useState(false);

  const SelectDate = dayjs(value).format('YYYY-MM-DD');

  const modalRef = useRef<HTMLDivElement>(null);
  const handleShowCalendar = () => {
    setIsShowCalendar((prev) => !prev);
  };

  useEffect(() => {
    setIsShowCalendar(false);
  }, [value]);

  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside);

    return () => {
      document.removeEventListener('mousedown', clickModalOutside);
    };
  });

  const clickModalOutside = (e: MouseEvent) => {
    if (!modalRef.current) return;
    if (isShowCalendar && !modalRef.current.contains(e.target as Node)) {
      setIsShowCalendar(false);
    }
  };

  return (
    <div className={styles.datePicker} ref={modalRef}>
      <button type='button' onClick={handleShowCalendar} className={styles.dateButton}>
        {SelectDate}
      </button>
      {isShowCalendar && <Calendar onChange={onChange} value={value} />}
    </div>
  );
};

export default DateCalendar;
