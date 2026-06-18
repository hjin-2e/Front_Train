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

// 총 탑승 인원에 따른 연석 배정 좌석 목록 생성기 (MyTicketList & Ticket 연동)
function generateSeatStr(reservationId: string, totalCount: number): string {
  if (!reservationId || totalCount <= 0) return "5호차 12A석";

  // 1. UUID를 해싱하여 '대표 시작 위치'를 결정론적으로 계산
  let hash = 0;
  for (let i = 0; i < reservationId.length; i++) {
    hash = reservationId.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  let carNumber = (hash % 12) + 1; // 1호차 ~ 12호차
  let seatRow = (hash % 13) + 1;  // 1열 ~ 13열 (일인 증가 시 15열 초과 방지를 위해 여유있게 시작)
  let colIndex = hash % 4;        // 0(A), 1(B), 2(C), 3(D)
  const seatLetters = ['A', 'B', 'C', 'D'];

  const seats: string[] = [];
  for (let i = 0; i < totalCount; i++) {
    seats.push(`${carNumber}호차 ${seatRow}${seatLetters[colIndex]}`);

    // 옆자리로 이동
    colIndex++;
    if (colIndex > 3) {
      colIndex = 0;
      seatRow++; // A열로 넘어가며 다음 행으로 이동

      // 만약 한 호차의 최대 행(15열)을 넘어가면 다음 호차의 1열로 강제 이동 (에러 방지)
      if (seatRow > 15) {
        seatRow = 1;
        carNumber++;
        if (carNumber > 15) { // 15호차 초과 시 1호차로 순환
          carNumber = 1;
        }
      }
    }
  }

  return seats.join(', ');
}


export default function TicketView() {
  const location = useLocation();
  const navigate = useNavigate();

  // 상태 관리: 서버에서 받아온 승차권 정보 저장
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    console.log("🔍 [MyTicketList] location.state =", location.state);
    // 1. location.state를 통해 비회원 조회 데이터(ticketData)가 전달되었는지 확인
    if (location.state && location.state.ticketData) {
      const rawData = location.state.ticketData;
      console.log("🔍 [MyTicketList] rawData =", rawData);

      // 이미 가공된 구조인 경우
      if (rawData.ticket) {
        setTicket(rawData.ticket);
        setIsLoading(false);
      } else if (rawData.reservation_uuid) {
        // 비회원 단건 조회 DB Row 데이터를 TicketData 인터페이스 형태로 매핑
        const depDateStr = rawData.departure_date ? String(rawData.departure_date).slice(0, 10) : '';
        const [yearStr, monthStr, dayStr] = depDateStr.split('-');

        const mappedTicket: TicketData = {
          reservationId: rawData.reservation_uuid,
          startStation: rawData.start_station,
          endStation: rawData.end_station,
          selectedYear: parseInt(yearStr, 10) || 2026,
          selectedMonth: parseInt(monthStr, 10) || 6,
          selectedDay: parseInt(dayStr, 10) || 19,
          depTime: rawData.departure_time,
          trainType: 'KTX',
          trainNumber: rawData.train_number,
          seatType: '일반실',
          passengerStr: `어른 ${rawData.passenger_count}명`,
          totalPassengers: rawData.passenger_count,
          totalPriceStr: `${(rawData.passenger_count * 59800).toLocaleString()}원`
        };
        setTicket(mappedTicket);
        setIsLoading(false);
      } else {
        setErrorMsg('유효한 승차권 정보가 존재하지 않습니다.');
        setIsLoading(false);
      }
      return;
    }

    const fetchTicketData = async () => {
      try {
        setIsLoading(true);
        // 2. 유저 식별자 가져오기
        const userId = localStorage.getItem('cognito_sub') || 'e9a6f3b0-4f51-4b7b-8c88-e9f06a1f81d1';

        // 3. 서버에 유저의 최신 예약/승차권 정보 GET 요청
        const response = await apiClient.get(`/api/reserve?userId=${userId}`);

        if (response.data && response.data.ticket) {
          setTicket(response.data.ticket);
        } else {
          setErrorMsg('유효한 승차권 정보가 존재하지 않습니다.');
        }
      } catch (err) {
        console.error('승차권 조회 실패:', err);
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
                <li><strong>이용 열차:</strong> {ticket.trainNumber}</li>
                <li><strong>선택 좌석:</strong> {generateSeatStr(ticket.reservationId, ticket.totalPassengers)}</li>
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