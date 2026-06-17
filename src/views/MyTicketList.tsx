import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

// 서버에서 받아올 실제 승차권(예약) 데이터 타입 정의
interface TicketData {
  reservationId: string;
  startStation: string;
  endStation: string;
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
  depTime: string;
  trainType: string;
  trainNumber: string;
  seatType: string;
  passengerStr: string;
  totalPassengers: number;
  totalPriceStr: string;
}

export default function TicketView() {
  const location = useLocation();
  const navigate = useNavigate();

  // 상태 관리: 서버에서 받아온 승차권 정보 저장
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setIsLoading(true);
        // 1. 유저 식별자 가져오기
        const userId = localStorage.getItem('cognito_sub') || 'e9a6f3b0-4f51-4b7b-8c88-e9f06a1f81d1';

        // 2. 서버에 유저의 최신 예약/승차권 정보 GET 요청
        const response = await apiClient.get(`/api/reserve?userId=${userId}`);
        
        if (response.data && response.data.ticket) {
          setTicket(response.data.ticket);
        } else {
          setErrorMsg('유효한 승차권 정보가 존재하지 않습니다.');
        }
      } catch (err) { //  타입 지정을 생략하면 기본적으로 unknown이 됩니다.
				console.error('승차권 조회 실패:', err);
				
				// err 객체를 안전하게 단언하여 사용합니다.
				const error = err as any; 
				setErrorMsg(error.response?.data?.message || '승차권을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketData();
  }, [location.state]);

  // 로딩 중 화면
  if (isLoading) {
    return (
      <div className="sub-page">
        <div className="sub-top">
          <div className="page-title">
            <h2>승차권 조회</h2>
          </div>
        </div>

        <div className="breadcrumb">
          <div className="page-path-list">
            <div className="page-path">
              <span className="ico-home"></span> 홈 &gt; 예매 &gt; 승차권 조회
            </div>
            <div className="print" title="인쇄" onClick={() => window.print()} style={{ cursor: 'pointer' }}></div>
          </div>
        </div>

        <div className="cont-inner">
          <div className="content-sub-box">
            <p className="sub-tit">나의 모바일 승차권</p>
            <div className="ticket-list">
              <div className="ticket-info">
                <h2 className="ticket-itxt">⏳ 승차권 정보를 조회하고 있습니다...</h2>
              </div>
            </div>
            
            <div className="btn-group">
              <button className="btn-home" onClick={() => navigate('/')}>
                홈으로 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생 또는 데이터 없음
  if (errorMsg || !ticket) {
    return (
      <div className="sub-page">
        <div className="sub-top">
          <div className="page-title">
            <h2>승차권 조회</h2>
          </div>
        </div>

        <div className="breadcrumb">
          <div className="page-path-list">
            <div className="page-path">
              <span className="ico-home"></span> 홈 &gt; 예매 &gt; 승차권 조회
            </div>
            <div className="print" title="인쇄" onClick={() => window.print()} style={{ cursor: 'pointer' }}></div>
          </div>
        </div>

        <div className="cont-inner">
          <div className="content-sub-box">
            <p className="sub-tit">나의 모바일 승차권</p>
            <div className="ticket-list">
              <div className="ticket-info">
                <h2 className="ticket-itxt err">{errorMsg || '조회된 승차권이 없습니다.'}</h2>
              </div>
            </div>
            
            <div className="btn-group">
              <button className="btn-home" onClick={() => navigate('/')}>
                홈으로 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sub-page">
      <div className="sub-top">
        <div className="page-title">
          <h2>승차권 조회</h2>
        </div>
      </div>

      <div className="breadcrumb">
        <div className="page-path-list">
          <div className="page-path">
            <span className="ico-home"></span> 홈 &gt; 예매 &gt; 승차권 조회
          </div>
          <div className="print" title="인쇄" onClick={() => window.print()} style={{ cursor: 'pointer' }}></div>
        </div>
      </div>

      <div className="cont-inner">
        <div className="content-sub-box">
          <p className="sub-tit">나의 모바일 승차권</p>
          <div className="ticket-list">
            <div className="ticket-info">
              <p className="t-info-txt">
                <strong>발권 번호:</strong> {ticket.reservationId}
              </p>

              <ul className="c-info">
                <li><strong>구간 정보:</strong> {ticket.startStation} ➔ {ticket.endStation}</li>
                <li><strong>출발 일시:</strong> {ticket.selectedYear || 2026}년 {ticket.selectedMonth}월 {ticket.selectedDay}일 {ticket.depTime}</li>
                <li><strong>이용 열차:</strong> {ticket.trainType} 제 {ticket.trainNumber}열차</li>
                <li><strong>선택 좌석:</strong> {ticket.seatType}</li>
                <li><strong>승차 인원:</strong> {ticket.passengerStr} (총 {ticket.totalPassengers}명)</li>
              </ul>
            </div>
          </div>
          
          <div className="btn-group">
            <button className="btn-home" onClick={() => navigate('/')}>
              홈으로 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}