import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Train { id: string; type: string; number: string; depTime: string; arrTime: string; duration: string; normalPrice: string; specialPrice: string; borderColor: string; }
interface RouteState { startStation?: string; endStation?: string; selectedYear?: number; selectedMonth?: number; selectedDay?: number; selectedHour?: number; passengerStr?: string; passenger?: { adult: number; child: number; infant: number; senior: number }; }

export default function TrainList() {
  const location = useLocation();
  const navigate = useNavigate();
  const today = new Date();

  const searchData = (location.state as RouteState) || {};

  const [startStation, setStartStation] = useState<string>(searchData.startStation || '서울');
  const [endStation, setEndStation] = useState<string>(searchData.endStation || '부산');
  const [selectedYear, setSelectedYear] = useState<number>(searchData.selectedYear || today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(searchData.selectedMonth || today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(searchData.selectedDay || today.getDate());
  const [selectedHour, setSelectedHour] = useState<number>(searchData.selectedHour || 10);

  const [passenger, setPassenger] = useState(searchData.passenger || { adult: 1, child: 0, infant: 0, senior: 0 });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTarget, setModalTarget] = useState<'start' | 'end'>('start');
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState<boolean>(false);

  const [tempYear, setTempYear] = useState<number>(selectedYear);
  const [tempMonth, setTempMonth] = useState<number>(selectedMonth);
  const [tempDay, setTempDay] = useState<number>(selectedDay);
  const [tempHour, setTempHour] = useState<number>(selectedHour);
  const [tempPassenger, setTempPassenger] = useState({ ...passenger });

  const getDayOfWeek = (year: number, month: number, day: number) => { const days = ['일', '월', '화', '수', '목', '금', '토']; return days[new Date(year, month - 1, day).getDay()]; };
  const getPassengerString = () => { const parts = []; if (passenger.adult > 0) parts.push(`어른 ${passenger.adult}명`); if (passenger.child > 0) parts.push(`어린이 ${passenger.child}명`); if (passenger.infant > 0) parts.push(`유아 ${passenger.infant}명`); if (passenger.senior > 0) parts.push(`경로 ${passenger.senior}명`); return parts.join(', '); };
  const getTotalPassengerCount = () => passenger.adult + passenger.child + passenger.infant + passenger.senior;

  const handlePrevDay = () => {
    const d = new Date(selectedYear, selectedMonth - 1, selectedDay - 1);
    const check = new Date(); check.setHours(0, 0, 0, 0);
    if (d >= check) { setSelectedYear(d.getFullYear()); setSelectedMonth(d.getMonth() + 1); setSelectedDay(d.getDate()); } else alert("오늘 이전 날짜는 선택할 수 없습니다.");
  };

  const handleNextDay = () => {
    const d = new Date(selectedYear, selectedMonth - 1, selectedDay + 1);
    setSelectedYear(d.getFullYear()); setSelectedMonth(d.getMonth() + 1); setSelectedDay(d.getDate());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevMonth = () => {
    let y = tempYear, m = tempMonth - 1;
    if (m < 1) { m = 12; y -= 1; }
    if (new Date(y, m - 1, 1) >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setTempYear(y); setTempMonth(m);
      const maxDays = new Date(y, m, 0).getDate();
      if (tempDay > maxDays) setTempDay(maxDays);
      if (y === today.getFullYear() && m === today.getMonth() + 1 && tempDay < today.getDate()) setTempDay(today.getDate());
    }
  };

  const handleNextMonth = () => {
    let y = tempYear, m = tempMonth + 1;
    if (m > 12) { m = 1; y += 1; }
    setTempYear(y); setTempMonth(m);
    const maxDays = new Date(y, m, 0).getDate();
    if (tempDay > maxDays) setTempDay(maxDays);
  };

  const majorStations = ['서울', '용산', '광명', '수서', '영등포', '수원', '평택', '천안아산', '천안', '오송', '조치원', '대전', '서대전', '김천구미', '구미', '동대구', '대구', '경주', '울산(통도사)', '포항', '부산', '구포', '익산', '전주', '광주송정', '목포', '순천', '청량리', '남춘천', '동해', '강릉', '정동진', '안동', '서원주', '원주', '마산', '행신', '나주', '정읍', '남원'];
  const dummyTrains: Train[] = [
    { id: '1', type: 'KTX', number: '001', depTime: '05:13', arrTime: '07:50', duration: '2시간 37분', normalPrice: '59,800원', specialPrice: '83,700원', borderColor: '#0054a6' },
    { id: '2', type: 'KTX', number: '161', depTime: '05:18', arrTime: '08:16', duration: '2시간 58분', normalPrice: '53,900원', specialPrice: '75,500원', borderColor: '#0054a6' },
    { id: '3', type: 'KTX', number: '003', depTime: '05:27', arrTime: '08:16', duration: '2시간 49분', normalPrice: '59,800원', specialPrice: '83,700원', borderColor: '#0054a6' },
    { id: '4', type: 'ITX-새마을', number: '1001', depTime: '05:54', arrTime: '11:14', duration: '5시간 20분', normalPrice: '42,600원', specialPrice: '59,600원', borderColor: '#0081b3' },
    { id: '5', type: 'KTX', number: '005', depTime: '05:58', arrTime: '08:43', duration: '2시간 45분', normalPrice: '59,400원', specialPrice: '83,200원', borderColor: '#0054a6' },
    { id: '6', type: 'KTX-산천', number: '075', depTime: '06:03', arrTime: '08:49', duration: '2시간 46분', normalPrice: '59,800원', specialPrice: '83,700원', borderColor: '#0054a6' },
    { id: '7', type: 'ITX-새마을', number: '1003', depTime: '06:13', arrTime: '11:26', duration: '5시간 13분', normalPrice: '42,600원', specialPrice: '59,600원', borderColor: '#0081b3' },
    { id: '8', type: '무궁화호', number: '1151', depTime: '06:37', arrTime: '12:11', duration: '5시간 34분', normalPrice: '28,600원', specialPrice: '40,000원', borderColor: '#ff6600' }
  ];

  const handleStationSelect = (station: string) => { if (modalTarget === 'start') setStartStation(station); else setEndStation(station); setIsModalOpen(false); };
  const handleDateApply = () => { setSelectedYear(tempYear); setSelectedMonth(tempMonth); setSelectedDay(tempDay); setSelectedHour(tempHour); setIsDateModalOpen(false); };
  const handlePassengerApply = () => { setPassenger({ ...tempPassenger }); setIsPassengerModalOpen(false); };
  const updateCount = (type: 'adult' | 'child' | 'infant' | 'senior', op: 'plus' | 'minus') => {
    const currentTotal = tempPassenger.adult + tempPassenger.child + tempPassenger.infant + tempPassenger.senior;
    if (op === 'plus') { if (currentTotal >= 9) return alert('최대 9명까지 예매 가능합니다.'); setTempPassenger((p: any) => ({ ...p, [type]: p[type] + 1 })); }
    else { if (tempPassenger[type] <= 0 || (type === 'adult' && tempPassenger[type] === 1 && currentTotal === 1)) return; setTempPassenger((p: any) => ({ ...p, [type]: p[type] - 1 })); }
  };

  const handleSelectTrain = (train: Train, seatType: '일반석' | '특실') => {
    navigate('/confirm', { state: { startStation, endStation, selectedYear, selectedMonth, selectedDay, selectedHour, passengerStr: getPassengerString(), selectedTrain: train, selectedSeatType: seatType } });
  };

  const generateMonthWeeks = (year: number, month: number) => {
    const weeks: (number | null)[][] = []; const totalDays = new Date(year, month, 0).getDate(); const startDay = new Date(year, month - 1, 1).getDay();
    let currentWeek: (number | null)[] = Array(7).fill(null);
    for (let i = 0; i < startDay; i++) currentWeek[i] = null;
    let idx = startDay;
    for (let day = 1; day <= totalDays; day++) { currentWeek[idx++] = day; if (idx === 7) { weeks.push(currentWeek); currentWeek = Array(7).fill(null); idx = 0; } }
    if (idx > 0) weeks.push(currentWeek); return weeks;
  };
  const currentWeeks = generateMonthWeeks(tempYear, tempMonth);
  const getTrainLogoClass = (trainName: string) => {
    if (trainName.includes('KTX-산천')) return 'logo-sancheon';
    if (trainName.includes('KTX')) return 'logo-ktx';
    if (trainName.includes('ITX-새마을')) return 'logo-itx';
    if (trainName.includes('무궁화')) return 'logo-mugung';
    return '';
  };
  const availableHours = Array.from({ length: 14 }, (_, i) => 10 + i);

  return (
    <div className="sub-page">
      <div className="sub-top">
        <div className="page-title">
          <h2>승차권 예매</h2>
        </div>
      </div>
      <div className="breadcrumb">
        <div className="page-path">
          <span className="ico-home"></span> 홈 &gt; 예매 &gt; 승차권 예매
        </div>
        <div className="print" title="인쇄"></div>
      </div>

      <div className="cont-inner">
        <div className="content-sub-box">
          <div className="date-nav-bar">
            <button onClick={handlePrevDay}>&lt;</button>
            <span onClick={() => { setTempYear(selectedYear); setTempMonth(selectedMonth); setTempDay(selectedDay); setTempHour(selectedHour); setIsDateModalOpen(true); }}>
              {`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}(${getDayOfWeek(selectedYear, selectedMonth, selectedDay)}) ${String(selectedHour).padStart(2, '0')}:00`}
            </span>
            <button onClick={handleNextDay}>&gt;</button>
          </div>

          <div className="filter-bar">
            <div className="select pill" onClick={() => { setModalTarget('start'); setIsModalOpen(true); }}><span className="ico ico-start"></span><span className="bold">{startStation}</span></div>
            <div className="swap">⇄</div>
            <div className="select pill" onClick={() => { setModalTarget('end'); setIsModalOpen(true); }}><span className="ico ico-end"></span><span className="bold">{endStation}</span></div>
            <div className="select pill" onClick={() => { setTempPassenger({ ...passenger }); setIsPassengerModalOpen(true); }}><span className="ico ico-user"></span><span className="bold">총 {getTotalPassengerCount()}명</span></div>
            <div className="select dropdown">일반석 ▾</div>
            <div className="select dropdown">직통 ▾</div>
          </div>

          <div className="train-card-list">
            {dummyTrains.map((train) => (
              <div key={train.id} className="train-card" style={{ borderLeft: '5px solid #0054a6' }}>
                <div className={`t-info ${train.type.includes('KTX') ? 'ktx' : 'other'}`}>
                  <span className={`type ${getTrainLogoClass(train.type)}`}></span>
                  <span className="num">{train.number}</span>
                </div>
                <div className="t-route">
                  <div className="route-tit">{startStation} ➔ {endStation} <span className="time">({train.depTime} ~ {train.arrTime})</span></div>
                  <div className="dur">소요시간: {train.duration}</div>
                </div>
                <div className="t-seats">
                  <div className="seat" onClick={() => handleSelectTrain(train, '일반석')}>
                    <span className="s-tit">일반실</span><span className="s-prc">{train.normalPrice}</span><span className="s-mil">5%적립</span>
                  </div>
                  <div className="seat special" onClick={() => handleSelectTrain(train, '특실')}>
                    <span className="s-tit">특실</span><span className="s-prc special">{train.specialPrice}</span><span className="s-mil">5%적립</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💡 계산식 연동형 다음날 조회하기 버튼 적용 */}
          {(() => {
            const nextDate = new Date(selectedYear, selectedMonth - 1, selectedDay + 1);
            const nextYear = nextDate.getFullYear();
            const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
            const nextDay = String(nextDate.getDate()).padStart(2, '0');
            const nextDayOfWeek = getDayOfWeek(nextYear, nextDate.getMonth() + 1, nextDate.getDate());
            
            return (
              <button className="btn-next-day" onClick={handleNextDay}>
                {`${nextYear}-${nextMonth}-${nextDay}(${nextDayOfWeek}) 조회하기 ➔`}
              </button>
            );
          })()}
        </div>

        {/* 기차역 모달 */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content lg square" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header line">
                <h3>기차역 조회</h3>
                <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <div className="search-input-bar">
                <input type="text" placeholder="역 이름 또는 초성 검색(서울 : ㅅㅇ)" readOnly />
                <span>🔍</span>
              </div>
              <div className="tab-group">
                <div className="tab active">주요역</div><div className="tab">지역별</div>
              </div>
              <div className="station-grid">
                {majorStations.map((station) => (
                  <button key={station} className={`station-btn ${startStation === station || endStation === station ? 'active' : ''}`} onClick={() => handleStationSelect(station)}>{station}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 날짜 모달 */}
        {isDateModalOpen && (
          <div className="modal-overlay" onClick={() => setIsDateModalOpen(false)}>
            <div className="modal-content md" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>날짜 변경</h3>
                <button className="btn-close" onClick={() => setIsDateModalOpen(false)}>&times;</button>
              </div>
              <div className="date-info-box">
                <div className="date-str">{tempYear}년 {String(tempMonth).padStart(2, '0')}월 {String(tempDay).padStart(2, '0')}일({getDayOfWeek(tempYear, tempMonth, tempDay)})</div>
                <div className="time-str">{tempHour}시 이후 출발</div>
              </div>
              <div className="month-nav">
                <span className={`arrow ${tempYear === today.getFullYear() && tempMonth === today.getMonth() + 1 ? 'disabled' : ''}`} onClick={handlePrevMonth}>&lt;</span>
                <span className="current">{tempYear}. {String(tempMonth).padStart(2, '0')}.</span>
                <span className="arrow" onClick={handleNextMonth}>&gt;</span>
              </div>
              <table className="calendar-table">
                <thead><tr><th className="sun">일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th className="sat">토</th></tr></thead>
                <tbody>
                  {currentWeeks.map((week, wIdx) => (
                    <tr key={wIdx}>
                      {week.map((day, dIdx) => {
                        if (day === null) return <td key={dIdx}></td>;
                        const now = new Date(); now.setHours(0, 0, 0, 0); const cellDate = new Date(tempYear, tempMonth - 1, day); const isPast = cellDate < now; const isSelected = tempDay === day;
                        let cls = isPast ? 'past' : ''; if (dIdx === 0) cls += ' sun'; else if (dIdx === 6) cls += ' sat'; if (isSelected) cls += ' selected';
                        return (
                          <td key={dIdx} className={cls.trim()} onClick={() => !isPast && setTempDay(day)}>
                            {isSelected ? <div className="sel-box"><span className="d">{day}</span><span className="t">출발일</span></div> : day}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="time-select-wrap">
                <div className="tit">시간선택</div>
                <div className="track-wrap">
                  <span className="arrow">&lt;</span>
                  <div className="track">
                    {availableHours.map((hour) => <button type="button" key={hour} className={`time-btn ${tempHour === hour ? 'active' : ''}`} onClick={() => setTempHour(hour)}>{hour}시</button>)}
                  </div>
                  <span className="arrow">&gt;</span>
                </div>
              </div>
              <div className="modal-btn-wrap">
                <button className="btn-cancel" onClick={() => setIsDateModalOpen(false)}>취소</button>
                <button className="btn-submit" onClick={handleDateApply}>적용</button>
              </div>
            </div>
          </div>
        )}

        {/* 인원 변경 모달 */}
        {isPassengerModalOpen && (
          <div className="modal-overlay" onClick={() => setIsPassengerModalOpen(false)}>
            <div className="modal-content sm" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header line-dark">
                <h3>인원 변경</h3>
                <button className="btn-close" onClick={() => setIsPassengerModalOpen(false)}>&times;</button>
              </div>
              <div className="passenger-list">
                {[{ type: 'adult', label: '어른', desc: '만 13세 이상' }, { type: 'child', label: '어린이', desc: '만 6세 ~ 12세' }, { type: 'infant', label: '유아', desc: '만 6세 미만' }, { type: 'senior', label: '경로', desc: '만 65세 이상' }].map((item) => {
                  const t = item.type as 'adult' | 'child' | 'infant' | 'senior'; const c = tempPassenger[t];
                  return (
                    <div key={item.type} className="passenger-row">
                      <div className="info"><span className="label">{item.label}</span><span className="desc">{item.desc}</span></div>
                      <div className="counter">
                        <button type="button" className={c === 0 ? 'disabled' : ''} onClick={() => updateCount(t, 'minus')}>-</button>
                        <div className="num">{c}</div>
                        <button type="button" onClick={() => updateCount(t, 'plus')}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="modal-btn-wrap">
                <button className="btn-cancel" onClick={() => setIsPassengerModalOpen(false)}>취소</button>
                <button className="btn-submit" onClick={handlePassengerApply}>변경 적용</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}