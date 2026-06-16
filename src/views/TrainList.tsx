import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useLocation, useNavigate } from 'react-router-dom';

// 공통 레이어 팝업
import StationSelectModal from '../components/StationSelectModal';
import DateSelectModal from '../components/DateSelectModal';
import PassengerSelectModal from '../components/PassengerSelectModal';

export interface PassengerType {
  adult: number;
  child: number;
  infant: number;
  senior: number;
}

interface Train { 
  id: string; 
  type: string; 
  number: string; 
  depTime: string; 
  arrTime: string; 
  duration: string; 
  normalPrice: string; 
  specialPrice: string; 
  borderColor: string; 
}

interface RouteState { 
  startStation?: string; 
  endStation?: string; 
  selectedYear?: number; 
  selectedMonth?: number; 
  selectedDay?: number; 
  selectedHour?: number; 
  passengerStr?: string; 
  passenger?: PassengerType;
}

export default function TrainList() {
  const location = useLocation();
  const navigate = useNavigate();
  const today = new Date();

  const searchData = (location.state as RouteState) || {};

  // 1. 핵심 조회 조건 상태 관리
  const [startStation, setStartStation] = useState<string>(searchData.startStation || '서울');
  const [endStation, setEndStation] = useState<string>(searchData.endStation || '부산');
  const [selectedYear, setSelectedYear] = useState<number>(searchData.selectedYear || today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(searchData.selectedMonth || today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(searchData.selectedDay || today.getDate());
  const [selectedHour, setSelectedHour] = useState<number>(searchData.selectedHour || 10);
  const [passenger, setPassenger] = useState<PassengerType>(searchData.passenger || { adult: 1, child: 0, infant: 0, senior: 0 });

  // 2. 모달 열림/닫힘 상태 관리
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTarget, setModalTarget] = useState<'start' | 'end'>('start');
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState<boolean>(false);

  // 3. 유틸리티 함수들
  const getDayOfWeek = (year: number, month: number, day: number) => { 
    const days = ['일', '월', '화', '수', '목', '금', '토']; 
    return days[new Date(year, month - 1, day).getDay()]; 
  };

  const getPassengerString = () => { 
    const labels: Record<string, string> = { adult: '어른', child: '어린이', infant: '유아', senior: '경로' };
    return Object.entries(passenger)
      .filter(([, count]) => count > 0)
      .map(([key, count]) => `${labels[key]} ${count}명`)
      .join(', ');
  };

  const getTotalPassengerCount = () => passenger.adult + passenger.child + passenger.infant + passenger.senior;

  // 4. 날짜 탐색 액션 함수
  const handlePrevDay = () => {
    const d = new Date(selectedYear, selectedMonth - 1, selectedDay - 1);
    const check = new Date(); check.setHours(0, 0, 0, 0);
    if (d >= check) { 
      setSelectedYear(d.getFullYear()); 
      setSelectedMonth(d.getMonth() + 1); 
      setSelectedDay(d.getDate()); 
    } else {
      alert("오늘 이전 날짜는 선택할 수 없습니다.");
    }
  };

  const handleNextDay = () => {
    const d = new Date(selectedYear, selectedMonth - 1, selectedDay + 1);
    setSelectedYear(d.getFullYear()); 
    setSelectedMonth(d.getMonth() + 1); 
    setSelectedDay(d.getDate());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. 공통 모달 적용(Apply) 핸들러 함수들
  const handleStationSelect = (station: string) => { 
    if (modalTarget === 'start') setStartStation(station); 
    else setEndStation(station); 
    setIsModalOpen(false); 
  };

  const handleDateApply = (year: number, month: number, day: number, hour: number) => { 
    setSelectedYear(year); 
    setSelectedMonth(month); 
    setSelectedDay(day); 
    setSelectedHour(hour); 
    setIsDateModalOpen(false); 
  };

  const handlePassengerApply = (passengerData: PassengerType) => { 
    setPassenger(passengerData); 
    setIsPassengerModalOpen(false); 
  };

  // 6. 더미 데이터 및 로고 핸들러
  const dummyTrains: Train[] = [
    { id: '1', type: 'KTX', number: '001', depTime: '09:13', arrTime: '11:50', duration: '2시간 37분', normalPrice: '59,800원', specialPrice: '83,700원', borderColor: '#0054a6' },
    { id: '2', type: 'KTX', number: '161', depTime: '09:50', arrTime: '12:48', duration: '2시간 58분', normalPrice: '53,900원', specialPrice: '75,500원', borderColor: '#0054a6' },
    { id: '3', type: 'KTX', number: '003', depTime: '10:10', arrTime: '12:59', duration: '2시간 49분', normalPrice: '59,800원', specialPrice: '83,700원', borderColor: '#0054a6' },
    { id: '4', type: 'ITX-새마을', number: '1001', depTime: '11:20', arrTime: '16:40', duration: '5시간 20분', normalPrice: '42,600원', specialPrice: '59,600원', borderColor: '#0081b3' },
    { id: '5', type: 'KTX', number: '005', depTime: '12:05', arrTime: '14:50', duration: '2시간 45분', normalPrice: '59,400원', specialPrice: '83,200원', borderColor: '#0054a6' },
    { id: '6', type: 'KTX-산천', number: '075', depTime: '13:15', arrTime: '16:01', duration: '2시간 46분', normalPrice: '59,800원', specialPrice: '83,700원', borderColor: '#0054a6' },
    { id: '7', type: 'ITX-새마을', number: '1003', depTime: '14:40', arrTime: '19:53', duration: '5시간 13분', normalPrice: '42,600원', specialPrice: '59,600원', borderColor: '#0081b3' },
    { id: '8', type: '무궁화호', number: '1151', depTime: '15:30', arrTime: '21:04', duration: '5시간 34분', normalPrice: '28,600원', specialPrice: '40,000원', borderColor: '#ff6600' }
  ];

  const getStationCode = (krName: string) => {
    const map: Record<string, string> = { '서울': 'SEOUL', '대전': 'DAEJEON', '대구': 'DAEGU', '동대구': 'DAEGU', '부산': 'BUSAN' };
    return map[krName] || 'UNKNOWN';
  };

  const [seatInfo, setSeatInfo] = useState<Record<string, number>>({});
  const [loadingSeats, setLoadingSeats] = useState<boolean>(true);

  // 7. 좌석 정보 Fetch 이펙트
  const getActualTrainId = (dummyId: string) => {
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const baseId = parseInt(dummyId, 10);
    if (dateStr === '2026-06-26') return String(baseId);
    if (dateStr === '2026-06-27') return String(baseId + 8);
    if (dateStr === '2026-06-28') return String(baseId + 16);
    return null; // DB에 데이터가 없는 그 외의 날짜는 null 반환
  };

  // 7. 좌석 정보 Fetch 이펙트
  useEffect(() => {
    const fetchSeats = async () => {
      setLoadingSeats(true);
      const newSeatInfo: Record<string, number> = {};
      const startCode = getStationCode(startStation);
      const endCode = getStationCode(endStation);

      if (startCode === 'UNKNOWN' || endCode === 'UNKNOWN') {
        dummyTrains.forEach(t => newSeatInfo[t.id] = 0);
        setSeatInfo(newSeatInfo);
        setLoadingSeats(false);
        return;
      }

      await Promise.all(dummyTrains.map(async (train) => {
        try {
          const actualId = getActualTrainId(train.id);
          if (!actualId) {
            newSeatInfo[train.id] = 0; // 기차가 운행되지 않는 날짜는 잔여석 0석 처리
            return;
          }
          const res = await apiClient.get(`/api/trains/${actualId}`, {
            params: { start: startCode, end: endCode }
          });
          newSeatInfo[train.id] = res.data.availableSeats;
        } catch {
          newSeatInfo[train.id] = 0;
        }
      }));
      setSeatInfo(newSeatInfo);
      setLoadingSeats(false);
    };

    fetchSeats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startStation, endStation, selectedYear, selectedMonth, selectedDay]);

  const handleSelectTrain = (train: Train, seatType: '일반석' | '특실') => {
    // 💡 로그인 여부 확인
    const cognitoSub = localStorage.getItem('cognito_sub');
    const actualId = getActualTrainId(train.id);
    const actualTrain = { ...train, id: actualId };

    if (!cognitoSub) {
      alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
      navigate('/login', { 
        state: { 
          from: '/trains',
          trainState: { startStation, endStation, selectedYear, selectedMonth, selectedDay, selectedHour, passengerStr: getPassengerString(), passenger, selectedTrain: actualTrain, selectedSeatType: seatType }
        }
      });
      return;
    }

    const available = seatInfo[train.id];
    if (available === undefined || available <= 0) {
      alert('해당 열차는 매진되었습니다.');
      return;
    }
    navigate('/confirm', { 
      state: { startStation, endStation, selectedYear, selectedMonth, selectedDay, selectedHour, passengerStr: getPassengerString(), passenger, selectedTrain: actualTrain, selectedSeatType: seatType } 
    });
  };

  const getTrainLogoClass = (trainName: string) => {
    if (trainName.includes('KTX-산천')) return 'logo-sancheon';
    if (trainName.includes('KTX')) return 'logo-ktx';
    if (trainName.includes('ITX-새마을')) return 'logo-itx';
    if (trainName.includes('무궁화')) return 'logo-mugung';
    return '';
  };

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
            <button className="data-prev" onClick={handlePrevDay}></button>
            <span onClick={() => setIsDateModalOpen(true)}>
              {`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}(${getDayOfWeek(selectedYear, selectedMonth, selectedDay)}) ${String(selectedHour).padStart(2, '0')}:00`}
            </span>
            <button className="data-next" onClick={handleNextDay}></button>
          </div>

          <div className="filter-bar">
            <div className="select pill" onClick={() => { setModalTarget('start'); setIsModalOpen(true); }}><span className="ico ico-start"></span><span className="bold">{startStation}</span></div>
            <div className="swap">⇄</div>
            <div className="select pill" onClick={() => { setModalTarget('end'); setIsModalOpen(true); }}><span className="ico ico-end"></span><span className="bold">{endStation}</span></div>
            <div className="select pill" onClick={() => setIsPassengerModalOpen(true)}><span className="ico ico-user"></span><span className="bold">총 {getTotalPassengerCount()}명</span></div>
            <div className="select dropdown">일반석</div>
            <div className="select dropdown">직통</div>
          </div>

          <div className="train-card-list">
            {dummyTrains
              .filter(train => {
                const hour = parseInt(train.depTime.split(':')[0], 10);
                return hour >= selectedHour;
              })
              .map((train) => {
              const available = seatInfo[train.id];
              const isSoldOut = !loadingSeats && (available === undefined || available <= 0);
              const seatLabel = loadingSeats ? '조회중...' : (isSoldOut ? '매진' : `잔여 ${available}석`);

              return (
                <div key={train.id} className="train-card" style={{ borderLeft: '5px solid #0054a6', opacity: isSoldOut ? 0.6 : 1 }}>
                  <div className={`t-info ${train.type.includes('KTX') ? 'ktx' : 'other'}`}>
                    <span className={`type ${getTrainLogoClass(train.type)}`}></span>
                    <span className="num">{train.number}</span>
                  </div>
                  <div className="t-route">
                    <div className="route-tit">{startStation} ➔ {endStation} <span className="time">({train.depTime} ~ {train.arrTime})</span></div>
                    <div className="dur">소요시간: {train.duration}</div>
                  </div>
                  <div className="t-seats">
                    <div className={`seat ${isSoldOut ? 'sold-out' : ''}`} onClick={() => handleSelectTrain(train, '일반석')} style={{ cursor: isSoldOut ? 'not-allowed' : 'pointer' }}>
                      <span className="s-tit">일반실</span>
                      <span className="s-prc" style={{ color: isSoldOut ? '#999' : '' }}>{isSoldOut ? '-' : train.normalPrice}</span>
                      <span className="s-mil" style={{ color: isSoldOut ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>{seatLabel}</span>
                    </div>
                    <div className={`seat special ${isSoldOut ? 'sold-out' : ''}`} onClick={() => handleSelectTrain(train, '특실')} style={{ cursor: isSoldOut ? 'not-allowed' : 'pointer' }}>
                      <span className="s-tit">특실</span>
                      <span className="s-prc special" style={{ color: isSoldOut ? '#999' : '' }}>{isSoldOut ? '-' : train.specialPrice}</span>
                      <span className="s-mil" style={{ color: isSoldOut ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>{seatLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 계산식 연동형 다음날 조회하기 버튼 */}
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

        {/* 💡 공통 기차역 선택 모달 */}
        <StationSelectModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleStationSelect}
          startStation={startStation}
          endStation={endStation}
        />

        {/* 💡 공통 날짜 선택 모달 */}
        <DateSelectModal
          isOpen={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
          onApply={handleDateApply}
          initialYear={selectedYear}
          initialMonth={selectedMonth}
          initialDay={selectedDay}
          initialHour={selectedHour}
        />

        {/* 💡 공통 인원 선택 모달 */}
        <PassengerSelectModal
          isOpen={isPassengerModalOpen}
          onClose={() => setIsPassengerModalOpen(false)}
          onApply={handlePassengerApply}
          initialPassenger={passenger}
        />
      </div>
    </div>
  );
}