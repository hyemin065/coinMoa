import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { dateState } from '../../recoil/recoil';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';

import styles from './dateCalendar.module.scss';
import './Calendar.css';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
