import React, { useState } from 'react';
import { useOutletContext, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const MainView: React.FC = () => {
  const IMAGES = useOutletContext<Record<string, string>>();
  const navigate = useNavigate();
  const today = new Date();

  // 1. 역 선택 상태 관리
  const [startStation, setStartStation] = useState<string>('서울');
  const [endStation, setEndStation] = useState<string>('부산');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTarget, setModalTarget] = useState<'start' | 'end'>('start');

  // 2. 출발일 날짜/시간 실시간 연동 및 연도 동적 상태 추가
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [selectedHour, setSelectedHour] = useState<number>(today.getHours() < 10 ? 10 : today.getHours());

  const [tempYear, setTempYear] = useState<number>(today.getFullYear());
  const [tempMonth, setTempMonth] = useState<number>(today.getMonth() + 1);
  const [tempDay, setTempDay] = useState<number>(today.getDate());
  const [tempHour, setTempHour] = useState<number>(today.getHours() < 10 ? 10 : today.getHours());
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);

  // 3. 인원 선택 상태 관리
  const [passenger, setPassenger] = useState({ adult: 1, child: 0, infant: 0, senior: 0 });
  const [tempPassenger, setTempPassenger] = useState({ ...passenger });
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState<boolean>(false);

  // 요일 계산 함수
  const getDayOfWeek = (year: number, month: number, day: number) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = new Date(year, month - 1, day);
    return days[d.getDay()];
  };

  const openModal = (target: 'start' | 'end') => {
    setModalTarget(target);
    setIsModalOpen(true);
  };

  const handleStationSelect = (station: string) => {
    if (modalTarget === 'start') setStartStation(station);
    else setEndStation(station);
    setIsModalOpen(false);
  };

  const openDateModal = () => {
    setTempYear(selectedYear);
    setTempMonth(selectedMonth);
    setTempDay(selectedDay);
    setTempHour(selectedHour);
    setIsDateModalOpen(true);
  };

  const handleDateApply = () => {
    setSelectedYear(tempYear);
    setSelectedMonth(tempMonth);
    setSelectedDay(tempDay);
    setSelectedHour(tempHour);
    setIsDateModalOpen(false);
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

  const openPassengerModal = () => {
    setTempPassenger({ ...passenger });
    setIsPassengerModalOpen(true);
  };

  const handlePassengerApply = () => {
    setPassenger({ ...tempPassenger });
    setIsPassengerModalOpen(false);
  };

  const getPassengerString = () => {
    const parts = [];
    if (passenger.adult > 0) parts.push(`어른 ${passenger.adult}명`);
    if (passenger.child > 0) parts.push(`어린이 ${passenger.child}명`);
    if (passenger.infant > 0) parts.push(`유아 ${passenger.infant}명`);
    if (passenger.senior > 0) parts.push(`경로 ${passenger.senior}명`);
    return parts.join(', ');
  };

  const updateCount = (type: 'adult' | 'child' | 'infant' | 'senior', operation: 'plus' | 'minus') => {
    const currentTotal = tempPassenger.adult + tempPassenger.child + tempPassenger.infant + tempPassenger.senior;
    const currentVal = tempPassenger[type];

    if (operation === 'plus') {
      if (currentTotal >= 9) {
        alert('최대 9명까지 예매 가능합니다.');
        return;
      }
      setTempPassenger((prev: any) => ({ ...prev, [type]: currentVal + 1 }));
    } else {
      if (currentVal <= 0) return;
      if (type === 'adult' && currentVal === 1 && currentTotal === 1) {
        alert('최소 1명의 승객은 선택되어야 합니다.');
        return;
      }
      setTempPassenger((prev: any) => ({ ...prev, [type]: currentVal - 1 }));
    }
  };

  const handleSearchTrains = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/trains', {
      state: {
        startStation,
        endStation,
        selectedYear,
        selectedMonth,
        selectedDay,
        selectedHour,
        passengerStr: getPassengerString(),
        passenger: passenger
      }
    });
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
  const majorStations = [
    '서울', '용산', '광명', '수서', '영등포', '수원', '평택', '천안아산', '천안', '오송', '조치원', '대전', '서대전', '김천구미', '구미', '동대구', '대구', '경주', '울산', '포항', '부산', '구포', '익산', '전주', '광주송정', '목포', '순천', '청량리', '남춘천', '동해', '강릉', '정동진'
  ];

  return (
    <div className="main">
      <div className="main-visual">
        <div className="visual-slide-wrapper">
          {/* 원본 MainView의 애니메이션 슬라이더 유지 */}
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect={'fade'}
            speed={3000}
            autoplay={{
              delay: 3000, 
              disableOnInteraction: false,
            }}
            loop={true} 
            className="main-swiper">
            <SwiperSlide><img src={IMAGES['main.jpg']} alt="main_slide01" /></SwiperSlide>
            <SwiperSlide><img src={IMAGES['main02.jpg']} alt="main_slide02" /></SwiperSlide>
            <SwiperSlide><img src={IMAGES['main03.jpg']} alt="main_slide03" /></SwiperSlide>
          </Swiper>
          
          {/* 원본 MainView의 이벤트 팝업 및 퀵메뉴 유지 */}
          <div className="event-pop">
            <div className="event-layer">
              <div className="pop_box">
                <a href="https://www.korail.com/ticket/discountSystem/child" target="_self" title="열기">
                  <img src={IMAGES['main_pop.jpg']} alt="나에게 딱 맞는 할인상품 찾기" />
                </a>
              </div>
              <div className="myPage">
                <ul>
                  <li><a href="/ticket/search/general">승차권 예매</a></li>
                  <li><a href="/ticket/myticket/list">승차권 확인</a></li>
                  <li><a href="/ticket/reservation/list">예약승차권 조회/취소</a></li>
                  <li><a href="/ticket/guest/csc/korailcs">고객센터</a></li>
                  <li><a href="/ticket/reserve/guide/faq">자주찾는 질문(FAQ)</a></li>
                  <li><a href="/ticket/reserve/guide/pay">승차권 환불 위약금</a></li>
                  <li><a href="/ticket/train/trainGuide/etiquette">열차 내 물품 휴대 기준</a></li>
                  <li><a href="/ticket/membership/certify">예약보관금 반환접수</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* MainView2의 상호작용 간편 예매바 주입 */}
        <div className="ticket-box">
          <div className="ticket-wrap">
            <div className="start" onClick={() => openModal('start')} style={{ cursor: 'pointer' }}>
              <label htmlFor="labelstart" className="label">출발역</label>
              <div className="write-wrap">
                <input type="text" id="labelstart" value={startStation} readOnly />
                <a href="#none" className="btn_pop" onClick={(e) => e.preventDefault()}></a>
              </div>
            </div>
            <div className="end" onClick={() => openModal('end')} style={{ cursor: 'pointer' }}>
              <label htmlFor="labelend" className="label">도착역</label>
              <div className="write-wrap">
                <input type="text" id="labelend" value={endStation} readOnly />
                <a href="#none" className="btn_pop" onClick={(e) => e.preventDefault()}></a>
              </div>
            </div>
            <div className="day_start" onClick={openDateModal} style={{ cursor: 'pointer' }}>
              <label htmlFor="labelday" className="label">출발일</label>
              <div className="write-wrap">
                <input 
                  type="text" 
                  id="labelday" 
                  value={`${selectedYear}.${String(selectedMonth).padStart(2, '0')}.${String(selectedDay).padStart(2, '0')}(${getDayOfWeek(selectedYear, selectedMonth, selectedDay)}) ${selectedHour}시`} 
                  readOnly 
                />
                <a href="#none" className="btn_pop" onClick={(e) => e.preventDefault()}></a>
              </div>
            </div>
            <div className="total" onClick={openPassengerModal} style={{ cursor: 'pointer' }}>
              <label htmlFor="labelple" className="label">인원</label>
              <div className="write-wrap">
                <input type="text" id="labelple" value={getPassengerString()} readOnly />
                <a href="#none" className="btn_pop" onClick={(e) => e.preventDefault()}></a>
              </div>
            </div>
            <a className="btn_lookup" href="#none" onClick={handleSearchTrains}>열차 조회하기</a>
          </div>
        </div>
      </div>

      {/* 원본 MainView의 컨텐츠 영역 유지 */}
      <div className="contents-wrap">
        <section>
          <h2 className="tit">코레일은 <strong>다양한 할인상품</strong>으로 고객에게 다가가고 있습니다.</h2>
          <div className="cont-inner">
            <Swiper 
              slidesPerView={5}
              spaceBetween={30}
              loop={true}
              pagination={{ clickable: true }}
              navigation={true} 
              modules={[Navigation]} 
              className="slideSwiper pdt-list">
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/internet">인터넷 특가</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/discount">공공할인</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/childern">다자녀 행복</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/KTX">맘편한 KTX</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/cheerUp">힘내라 청춘</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/youth">청소년 드림</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/child">영업할인 공통안내</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/4people">4인동반석</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/Ncard2">N카드(KTX,새마을)</a></SwiperSlide>
            </Swiper>
          </div>
        </section>

        {/* 열차 이용 서비스 */}
        <section>
          <div className="imgbox">
            <div>
              <div><img src={IMAGES['main_cont01.png']} alt="컨텐츠이미지" /></div>
              <div><img src={IMAGES['main_cont02.png']} alt="컨텐츠이미지2" /></div>
            </div>
          </div>
        </section>

        {/* 종합 이용 가이드 */}
        <section>
          <div className="grid_wrap">
            <div className="grid_box">
              <h4 className="title">종합 이용 가이드</h4>
              <ul className="fl-cl">
                <li><a href="https://www.korail.com/ticket/reserve/guide/faq"><span className="icoWrap"></span><span className="s_tit">승차권<br />이용안내</span></a></li>
                <li><a href="https://www.korail.com/ticket/train/stationGuide/terminal"><span className="icoWrap"></span><span className="s_tit">광명역<br />도심공항터미널</span></a></li>
                <li><a href="https://www.korail.com/ticket/discountSystem"><span className="icoWrap"></span><span className="s_tit">할인제도</span></a></li>
                <li><a href="https://www.korail.com/ticket/guest/lost/register"><span className="icoWrap"></span><span className="s_tit">유실물</span></a></li>
                <li><a href="https://www.korail.com/ticket/train/stationGuide/store/info"><span className="icoWrap"></span><span className="s_tit">승차권<br />제휴할인</span></a></li>
                <li><a href="/ticket/reserve/train-timeTable"><span className="icoWrap"></span><span className="s_tit">열차운임/<br />시간표</span></a></li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* 공지사항 (원본 MainView 구조 유지) */}
      <div className="notice-wrap">
        <div className="cont-inner">
          <div className="notice-head">
            <h4>공지사항</h4>
            <a href="" className="btnMore">더보기</a>
          </div>
          <ul className="notice-list">
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
          </ul>
        </div>
      </div>

      {/* 💡 MainView2에서 추가된 모달 컴포넌트들 시작 */}
      
      {/* 기차역 조회 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header line">
              <h3>기차역 조회</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="search-input-bar">
              <input type="text" placeholder="역 이름 또는 초성 검색(서울 : ㅅㅇ)" readOnly />
              <span>🔍</span>
            </div>
            <div className="tab-group">
              <div className="tab active">주요역</div>
              <div className="tab">지역별</div>
            </div>
            <div className="station-grid">
              {majorStations.map((station) => (
                <button 
                  key={station} 
                  className={`station-btn ${startStation === station || endStation === station ? 'active' : ''}`}
                  onClick={() => handleStationSelect(station)}
                >
                  {station}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 날짜 선택 모달 */}
      {isDateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDateModalOpen(false)}>
          <div className="modal-content md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>날짜 선택</h3>
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
                              <span className="d">{day}</span>
                              <span className="t">출발일</span>
                            </div>
                          ) : day}
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
                  {availableHours.map((hour) => (
                    <button 
                      type="button" 
                      key={hour} 
                      className={`time-btn ${tempHour === hour ? 'active' : ''}`} 
                      onClick={() => setTempHour(hour)}
                    >
                      {hour}시
                    </button>
                  ))}
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

      {/* 인원 선택 모달 */}
      {isPassengerModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPassengerModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header line-dark">
              <h3>인원 선택</h3>
              <button className="btn-close" onClick={() => setIsPassengerModalOpen(false)}>&times;</button>
            </div>
            <div className="passenger-list">
              {[
                { type: 'adult', label: '어른', desc: '만 13세 이상' },
                { type: 'child', label: '어린이', desc: '만 6세 ~ 12세' },
                { type: 'infant', label: '유아', desc: '만 6세 미만' },
                { type: 'senior', label: '경로', desc: '만 65세 이상' }
              ].map((item) => {
                const targetType = item.type as 'adult' | 'child' | 'infant' | 'senior';
                const currentCount = tempPassenger[targetType];

                return (
                  <div key={item.type} className="passenger-row">
                    <div className="info">
                      <span className="label">{item.label}</span>
                      <span className="desc">{item.desc}</span>
                    </div>
                    <div className="counter">
                      <button 
                        type="button" 
                        className={currentCount === 0 ? 'disabled' : ''} 
                        onClick={() => updateCount(targetType, 'minus')}
                      >-</button>
                      <div className="num">{currentCount}</div>
                      <button type="button" onClick={() => updateCount(targetType, 'plus')}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="modal-btn-wrap">
              <button className="btn-cancel" onClick={() => setIsPassengerModalOpen(false)}>취소</button>
              <button className="btn-submit" onClick={handlePassengerApply}>적용</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainView;