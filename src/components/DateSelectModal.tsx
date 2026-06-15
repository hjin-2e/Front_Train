import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

interface DateSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 적용 버튼을 누를 때 부모 상태를 업데이트할 함수
  onApply: (year: number, month: number, day: number, hour: number) => void;
  initialYear: number;
  initialMonth: number;
  initialDay: number;
  initialHour: number;
}

const DateSelectModal: React.FC<DateSelectModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialYear,
  initialMonth,
  initialDay,
  initialHour,
}) => {
  if (!isOpen) return null;

  const today = new Date();

  // 모달 내부 임시 상태 관리
  const [tempYear, setTempYear] = useState<number>(initialYear);
  const [tempMonth, setTempMonth] = useState<number>(initialMonth);
  const [tempDay, setTempDay] = useState<number>(initialDay);
  const [tempHour, setTempHour] = useState<number>(initialHour);

  const getDayOfWeek = (year: number, month: number, day: number) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = new Date(year, month - 1, day);
    return days[d.getDay()];
  };

  const handlePrevMonth = () => {
    let newMonth = tempMonth - 1;
    let newYear = tempYear;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const targetDate = new Date(newYear, newMonth - 1, 1);

    if (targetDate >= minDate) {
      setTempYear(newYear);
      setTempMonth(newMonth);

      const maxDays = new Date(newYear, newMonth, 0).getDate();
      if (tempDay > maxDays) setTempDay(maxDays);
      
      if (newYear === today.getFullYear() && newMonth === today.getMonth() + 1) {
        if (tempDay < today.getDate()) setTempDay(today.getDate());
      }
    }
  };

  const handleNextMonth = () => {
    let newMonth = tempMonth + 1;
    let newYear = tempYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    setTempYear(newYear);
    setTempMonth(newMonth);

    const maxDays = new Date(newYear, newMonth, 0).getDate();
    if (tempDay > maxDays) setTempDay(maxDays);
  };

  const generateMonthWeeks = (year: number, month: number) => {
    const weeks: (number | null)[][] = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    const totalDays = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    let currentWeek: (number | null)[] = Array(7).fill(null);
    for (let i = 0; i < startDayOfWeek; i++) currentWeek[i] = null;
    
    let dayOfWeekIndex = startDayOfWeek;
    for (let day = 1; day <= totalDays; day++) {
      currentWeek[dayOfWeekIndex] = day;
      dayOfWeekIndex++;
      if (dayOfWeekIndex === 7) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
        dayOfWeekIndex = 0;
      }
    }
    if (dayOfWeekIndex > 0) weeks.push(currentWeek);
    return weeks;
  };

  const currentWeeks = generateMonthWeeks(tempYear, tempMonth);
  const availableHours = Array.from({ length: 14 }, (_, i) => 10 + i);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>날짜 선택</h3>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="date-info-box">
          <div className="date-str">
            {tempYear}년 {String(tempMonth).padStart(2, '0')}월 {String(tempDay).padStart(2, '0')}일
            ({getDayOfWeek(tempYear, tempMonth, tempDay)})
          </div>
          <div className="time-str">{tempHour}시 이후 출발</div>
        </div>
        
        <div className="month-nav">
          <span 
            className={`arrow month-prev ${tempYear === today.getFullYear() && tempMonth === today.getMonth() + 1 ? 'disabled' : ''}`} 
            onClick={handlePrevMonth}
          ></span>
          <span className="current">{tempYear}. {String(tempMonth).padStart(2, '0')}.</span>
          <span className="arrow month-next" onClick={handleNextMonth}></span>
        </div>

        <table className="calendar-table">
          <thead>
            <tr>
              <th className="sun">일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th className="sat">토</th>
            </tr>
          </thead>
          <tbody>
            {currentWeeks.map((week, wIdx) => (
              <tr key={wIdx}>
                {week.map((day, dIdx) => {
                  if (day === null) return <td key={dIdx}></td>;
                  const now = new Date(); now.setHours(0, 0, 0, 0); 
                  const cellDate = new Date(tempYear, tempMonth - 1, day);
                  const isPast = cellDate < now;
                  const isSelected = tempDay === day;
                  
                  let cls = isPast ? 'past' : '';
                  if (dIdx === 0) cls += ' sun';
                  else if (dIdx === 6) cls += ' sat';
                  if (isSelected) cls += ' selected';
                  
                  return (
                    <td key={dIdx} className={cls.trim()} onClick={() => !isPast && setTempDay(day)}>
                      {isSelected ? (
                        <div className="sel-box">
                          <span className="date">{day}</span>
                          <span className="txt">출발일</span>
                        </div>
                      ) : (
                        <div className="sel-box">
                          <span className="date">{day}</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 이전 단계에서 반영한 Swiper 적용 5개 노출 버전 */}
        <div className="time-select-wrap">
          <div className="tit">시간선택</div>
          <div className="track-wrap">
            <span className="arrow time-prev">&lt;</span>
            <div className="track" style={{ width: '100%', overflow: 'hidden' }}>
              <Swiper
                slidesPerView={5}
                spaceBetween={10}
                navigation={{ prevEl: '.time-prev', nextEl: '.time-next' }}
                modules={[Navigation]}
                className="time-swiper"
              >
                {availableHours.map((hour) => (
                  <SwiperSlide key={hour}>
                    <button 
                      type="button" 
                      className={`time-btn ${tempHour === hour ? 'active' : ''}`} 
                      onClick={() => setTempHour(hour)}
                      style={{ width: '100%' }}
                    >
                      {hour}시
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <span className="arrow time-next">&gt;</span>
          </div>
        </div>

        <div className="modal-btn-wrap">
          <button className="btn-cancel" onClick={onClose}>취소</button>
          <button className="btn-submit" onClick={() => onApply(tempYear, tempMonth, tempDay, tempHour)}>적용</button>
        </div>
      </div>
    </div>
  );
};

export default DateSelectModal;