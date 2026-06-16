import React, { useState } from 'react';
import { useOutletContext, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import apiClient from '../api/client';

// 공통 팝업페이지
import StationSelectModal from '../components/StationSelectModal';
import DateSelectModal from '../components/DateSelectModal';
import PassengerSelectModal from '../components/PassengerSelectModal';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface PassengerType {
  adult: number;
  child: number;
  infant: number;
  senior: number;
}

const MainView: React.FC = () => {
  const IMAGES = useOutletContext<Record<string, string>>();
  const navigate = useNavigate();
  const today = new Date();

  // 1. 역 선택 상태 관리
  const [startStation, setStartStation] = useState<string>('서울');
  const [endStation, setEndStation] = useState<string>('부산');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTarget, setModalTarget] = useState<'start' | 'end'>('start');

  // 2. 출발일 날짜/시간 상태 관리
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [selectedHour, setSelectedHour] = useState<number>(today.getHours() < 10 ? 10 : today.getHours());
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);

  // 3. 인원 선택 상태 관리
  const [passenger, setPassenger] = useState<PassengerType>({ adult: 1, child: 0, infant: 0, senior: 0 });
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState<boolean>(false);

  // 4. 백엔드 연결 상태 체크
  const [healthStatus, setHealthStatus] = useState<string>('');

  const handleHealthCheck = async () => {
    try {
      setHealthStatus('확인 중...');
      const response = await apiClient.get('/health');
      setHealthStatus(`✅ 연결 성공: ${response.data}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setHealthStatus(`❌ 연결 실패: ${error.message}`);
      } else {
        setHealthStatus('❌ 알 수 없는 연결 실패');
      }
    }
  };

  // 요일 계산 함수 (메인 뷰 인풋창 표시용)
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

  // 인원 선택 문자열 가공 함수 수정 (선언형 패턴)
  const getPassengerString = () => {
    const labels: Record<string, string> = { adult: '어른', child: '어린이', infant: '유아', senior: '경로' };
    return Object.entries(passenger)
      .filter(([_, count]) => count > 0)
      .map(([key, count]) => `${labels[key]} ${count}명`)
      .join(', ');
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

  return (
    <div className="main">
      <div className="main-visual">
        <div className="visual-slide-wrapper">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect={'fade'}
            speed={3000}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="main-swiper"
          >
            <SwiperSlide><img src={IMAGES['main.jpg']} alt="main_slide01" /></SwiperSlide>
            <SwiperSlide><img src={IMAGES['main02.jpg']} alt="main_slide02" /></SwiperSlide>
            <SwiperSlide><img src={IMAGES['main03.jpg']} alt="main_slide03" /></SwiperSlide>
          </Swiper>

          <div className="event-pop">
            <div className="event-layer">
              <div className="pop_box">
                <a href="https://www.korail.com/ticket/discountSystem/child" target="_self" title="열기">
                  <img src={IMAGES['main_pop.jpg']} alt="나에게 딱 맞는 할인상품 찾기" />
                </a>
              </div>
              <div className="myPage">
                <ul>
                  <li><a href="/trains">승차권 예매</a></li>
                  {/* <li><a href="https://www.korail.com//ticket/myticket/list" target="_blank">승차권 확인</a></li>
                  <li><a href="https://www.korail.com//ticket/reservation/list">예약승차권 조회/취소</a></li> */}
                  <li><a href="https://www.korail.com//ticket/guest/csc/korailcs">고객센터</a></li>
                  <li><a href="https://www.korail.com//ticket/reserve/guide/faq">자주찾는 질문(FAQ)</a></li>
                  <li><a href="https://www.korail.com//ticket/reserve/guide/pay">승차권 환불 위약금</a></li>
                  <li><a href="https://www.korail.com//ticket/train/trainGuide/etiquette">열차 내 물품 휴대 기준</a></li>
                  <li><a href="https://www.korail.com//ticket/membership/certify">예약보관금 반환접수</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 간편 예매바 상호작용 영역 */}
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
            <div className="day_start" onClick={() => setIsDateModalOpen(true)} style={{ cursor: 'pointer' }}>
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
            <div className="total" onClick={() => setIsPassengerModalOpen(true)} style={{ cursor: 'pointer' }}>
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

      {/* 컨텐츠 영역 */}
      <div className="contents-wrap">
        <section>
          <h2 className="tit">코레일은 <strong>다양한 할인상품</strong>으로 고객에게 다가가고 있습니다.</h2>
          <div className="cont-inner">
            <Swiper
              modules={[Navigation]} 
              slidesPerView={5}
              spaceBetween={30}
              loop={true}
              navigation={true}
              className="slideSwiper pdt-list"
            >
              {[...Array(2)].flatMap((_, i) => [
                <SwiperSlide key={`slide-1-${i}`}><a href="https://www.korail.com/ticket/discountSystem/internet">인터넷 특가</a></SwiperSlide>,
                <SwiperSlide key={`slide-2-${i}`}><a href="https://www.korail.com/ticket/discountSystem/discount">공공할인</a></SwiperSlide>,
                <SwiperSlide key={`slide-3-${i}`}><a href="https://www.korail.com/ticket/discountSystem/childern">다자녀 행복</a></SwiperSlide>,
                <SwiperSlide key={`slide-4-${i}`}><a href="https://www.korail.com/ticket/discountSystem/KTX">맘편한 KTX</a></SwiperSlide>,
                <SwiperSlide key={`slide-5-${i}`}><a href="https://www.korail.com/ticket/discountSystem/cheerUp">힘내라 청춘</a></SwiperSlide>,
                <SwiperSlide key={`slide-6-${i}`}><a href="https://www.korail.com/ticket/discountSystem/youth">청소년 드림</a></SwiperSlide>,
                <SwiperSlide key={`slide-7-${i}`}><a href="https://www.korail.com/ticket/discountSystem/child">영업할인 공통안내</a></SwiperSlide>,
                <SwiperSlide key={`slide-8-${i}`}><a href="https://www.korail.com/ticket/discountSystem/4people">4인동반석</a></SwiperSlide>,
                <SwiperSlide key={`slide-9-${i}`}><a href="https://www.korail.com/ticket/discountSystem/Ncard2">N카드(KTX,새마을)</a></SwiperSlide>
              ])}
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

      {/* 공지사항 및 서버 체크 */}
      <div className="notice-wrap">
        <div className="cont-inner">
          <div className="notice-head">
            <h4>공지사항</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>{healthStatus}</span>
              <button onClick={handleHealthCheck} style={{ padding: '4px 12px', backgroundColor: '#0052a4', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>서버 연결 테스트</button>
              <button className="btnMore" onClick={(e) => e.preventDefault()}>더보기</button>
            </div>
          </div>
          <ul className="notice-list">
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank" rel="noreferrer"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank" rel="noreferrer"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank" rel="noreferrer"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank" rel="noreferrer"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank" rel="noreferrer"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank" rel="noreferrer"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank" rel="noreferrer"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
            <li><a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank" rel="noreferrer"><p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p><span className="data">2026-04-30</span></a></li>
          </ul>
        </div>
      </div>

      {/* 💡 공통 모달 컴포넌트 연결 */}
      <StationSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleStationSelect}
        startStation={startStation}
        endStation={endStation}
      />

      <DateSelectModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onApply={handleDateApply}
        initialYear={selectedYear}
        initialMonth={selectedMonth}
        initialDay={selectedDay}
        initialHour={selectedHour}
      />

      <PassengerSelectModal
        isOpen={isPassengerModalOpen}
        onClose={() => setIsPassengerModalOpen(false)}
        onApply={handlePassengerApply}
        initialPassenger={passenger}
      />
    </div>
  );
};

export default MainView;