import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function TicketView() {
  const navigate = useNavigate();

  // 1. 비회원 입력 필드 상태(State) 선언
  const [ticketNumber, setTicketNumber] = useState('');
  const [email, setEmail] = useState('');

  // 2. 로딩 및 에러 처리 상태 선언
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 3. 조회하기 버튼 클릭 시 실행될 함수
  const handleSearch = async () => {
    // 공백 검사
    if (!ticketNumber.trim() || !email.trim()) {
      alert('승차권 발권 번호와 이메일을 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');

      // 서버 API 호출 (입력된 티켓번호와 이메일을 쿼리 스트링으로 전달)
      const response = await apiClient.get(`/api/reserve?ticketNumber=${ticketNumber}&email=${email}`);
      
      // 서버에서 정상적으로 데이터를 받아왔을 때
      if (response.data) {
        alert('조회가 완료되었습니다. 마이티켓 페이지로 이동합니다.');
        
        // 데이터와 함께 myticket 페이지로 이동
        navigate('/myticket', { 
          state: { 
            ticketData: response.data 
          } 
        });
      } else {
        setErrorMsg('유효한 승차권 정보가 존재하지 않습니다.');
      }
    } catch (err) {
      console.error('승차권 조회 실패:', err);
      
      // any를 사용하지 않고 안전하게 Axios 에러 구조 분기 처리
      if (err instanceof Error) {
        const axiosError = err as Record<string, any>;
        setErrorMsg(axiosError.response?.data?.message || '승차권을 불러오는 중 오류가 발생했습니다.');
      } else {
        setErrorMsg('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          <div 
            className="print" 
            title="인쇄" 
            onClick={() => window.print()} 
            style={{ cursor: 'pointer' }}
          ></div>
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

            {/* 에러 발생 시 UI에 빨간 글씨로 에러 표시 */}
            {errorMsg && (
              <p className="errtxt">
                {errorMsg}
              </p>
            )}

            <div className="info-list">
              <div className="inpt-box">
                <span>승차권 발권 번호</span>
                <div>
                  <input 
                    type="text" 
                    placeholder="예약된 승차권 발권번호를 입력해주세요" 
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="inpt-box">
                <span>이메일</span>
                <div>
                  <input 
                    type="text" 
                    placeholder="이메일을 입력해주세요" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="btn-group">
            <button 
              className="btn-apply" 
              onClick={handleSearch}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? '조회 중...' : '조회하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}