import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import { useSetRecoilState } from 'recoil';
import { dateState } from '../../recoil/recoil';
import './Calendar.css';
import styles from './dateCalendar.module.scss';

const DateCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [isShowCalendar, setIsShowCalendar] = useState(false);
  const setDate = useSetRecoilState(dateState);
  const SelectDate = dayjs(value).format('YYYY-MM-DD');

  const modalRef = useRef<HTMLDivElement>(null);
  const handleShowCalendar = () => {
    setIsShowCalendar((prev) => !prev);
  };

  useEffect(() => {
    setIsShowCalendar(false);
    setDate(SelectDate);
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
      {isShowCalendar && <Calendar onChange={setValue} value={value} />}
    </div>
  );
};

export default DateCalendar;
