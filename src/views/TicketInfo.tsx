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
          <p className="sub-tit">비회원 승차권 조회</p>
          <div className="info-box">
            <ul className="info-txt">
              <li>승차권 예매(발권) 시 정보를 입력해 주십시오.</li>
              <li>개인정보 보호를 위해 승차권 발권번호와 이메일 정보가 일치하는 내역만 조회됩니다.</li>
            </ul>

            <div className="info-list">
              <div className="inpt-box">
                <span>승차권 발권 번호</span>
                <div><input type="text" placeholder="예약된 승차권 발권번호를 입력해주세요" /></div>
              </div>
              <div className="inpt-box">
                <span>이메일</span>
                <div><input type="text" placeholder="이메일을 입력해주세요" /></div>
              </div>
            </div>
          </div>
          
          <div className="btn-group">
            <button className="btn-apply" onClick={() => navigate('/')}>조회하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}