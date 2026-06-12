
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import apiClient from '../api/client';

interface Train {
  id: string; type: string; number: string; depTime: string; arrTime: string;
  duration: string; normalPrice: string; specialPrice: string; borderColor: string;
}

interface RouteState {
  startStation?: string; endStation?: string; selectedYear?: number; selectedMonth?: number;
  selectedDay?: number; selectedHour?: number; passengerStr?: string; selectedTrain?: Train; selectedSeatType?: '일반석' | '특실';
}

export default function Confirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = (location.state as RouteState);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStatus, setProcessStatus] = useState<string>('');
  if (!data || !data.selectedTrain) {
    return <div style={{ padding: '20px', marginTop: '160px', textAlign: 'center' }}>선택된 여정 정보가 없습니다.</div>;
  }

  const basePriceStr = data.selectedSeatType === '특실' ? data.selectedTrain.specialPrice : data.selectedTrain.normalPrice;
  const numericPrice = parseInt(basePriceStr.replace(/[^0-9]/g, ''), 10);
  const passengerCounts = data.passengerStr?.match(/\d+(?=명)/g);
  const totalPassengers = passengerCounts ? passengerCounts.reduce((acc, cur) => acc + parseInt(cur, 10), 0) : 1;
  const totalPrice = numericPrice * totalPassengers;
  const totalPriceStr = totalPrice.toLocaleString() + '원';


  const getStationCode = (krName: string) => {
    const map: Record<string, string> = { '서울': 'SEOUL', '대전': 'DAEJEON', '대구': 'DAEGU', '동대구': 'DAEGU', '부산': 'BUSAN' };
    return map[krName] || 'UNKNOWN';
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setProcessStatus('좌석 확보 및 대기열 등록 중...');
    const userId = 'user123'; // 데모를 위한 고정 유저ID
    const trainId = data.selectedTrain!.id;
    const startCode = getStationCode(data.startStation!);
    const endCode = getStationCode(data.endStation!);

    if (startCode === 'UNKNOWN' || endCode === 'UNKNOWN') {
      alert('지원하지 않는 역입니다. (서울, 대전, 대구, 부산만 지원)');
      setIsProcessing(false);
      return;
    }

    try {
      // 1. 좌석 예약 요청 (Redis 원자적 차감 & SQS 큐 등록)
      const reserveRes = await apiClient.post('/api/reserve', {
        userId,
        trainId,
        startStation: startCode,
        endStation: endCode
      });

      const { reservationId } = reserveRes.data;
      setProcessStatus('결제 및 예약 확정 중...');
      
      // Worker가 SQS 큐를 처리하여 DB에 저장할 시간을 줍니다 (1.5초)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2. 예약 확정 (결제 완료) 요청 - 아직 DB 저장 전일 수 있으므로 최대 3회 폴링
      let confirmSuccess = false;
      for (let i = 0; i < 3; i++) {
        try {
          await apiClient.post('/api/reserve/confirm', {
            userId,
            trainId,
            reservationId
          });
          confirmSuccess = true;
          break; // 성공 시 루프 탈출
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          if (err.response?.status === 400 && err.response.data?.message?.includes('처리 중')) {
            setProcessStatus(`서버 처리 지연... 재시도 중 (${i+1}/3)`);
            await new Promise(resolve => setTimeout(resolve, 1500));
          } else {
            throw err; // 그 외 에러는 즉시 중단 (예: 만료, 중복)
          }
        }
      }

      if (!confirmSuccess) {
        throw new Error('예약 처리 시간이 초과되었습니다. 다시 시도해 주세요.');
      }

      setProcessStatus('결제 완료! 승차권 화면으로 이동합니다.');
      setTimeout(() => {
        navigate('/ticket', { state: { ...data, totalPriceStr } });
      }, 500);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.message || '서버 오류가 발생했습니다.';
      alert(`예약 실패: ${errMsg}`);
      setIsProcessing(false);
      setProcessStatus('');
    }
  };

  return (
    // 💡 content-box 대신 중앙 정렬을 위한 confirm-wrapper 클래스 적용
    <div className="sub-page confirm-wrapper">
      <div className="confirm-box">
        <h3 className="c-tit">결제 및 예매 정보 확인</h3>
        
        <div className="c-info">
          <div><strong>구간 정보:</strong> {data.startStation} ➔ {data.endStation}</div>
          <div><strong>출발 일시:</strong> {data.selectedYear || 2026}년 {data.selectedMonth}월 {data.selectedDay}일 {data.selectedTrain.depTime}</div>
          <div><strong>이용 열차:</strong> {data.selectedTrain.type} 제 {data.selectedTrain.number}열차</div>
          <div><strong>선택 좌석:</strong> {data.selectedSeatType} (순방향 자동 임의 배정)</div>
          <div><strong>승차 인원:</strong> {data.passengerStr} (총 {totalPassengers}명)</div>
          <div className="total-price">결제 금액: {totalPriceStr} (가상 결제)</div>
        </div>

        <div className="btn-group" style={{ flexDirection: 'column', gap: '10px' }}>
          {isProcessing ? (
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#0054a6', fontWeight: 'bold' }}>
              ⏳ {processStatus}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
              <button className="btn-prev" onClick={() => navigate('/trains', { state: data })}>이전으로</button>
              <button className="btn-pay" onClick={handlePayment}>발권하기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}