import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

  if (!data || !data.selectedTrain) {
    return <div style={{ padding: '20px', marginTop: '160px', textAlign: 'center' }}>선택된 여정 정보가 없습니다.</div>;
  }

  const basePriceStr = data.selectedSeatType === '특실' ? data.selectedTrain.specialPrice : data.selectedTrain.normalPrice;
  const numericPrice = parseInt(basePriceStr.replace(/[^0-9]/g, ''), 10);
  const passengerCounts = data.passengerStr?.match(/\d+(?=명)/g);
  const totalPassengers = passengerCounts ? passengerCounts.reduce((acc, cur) => acc + parseInt(cur, 10), 0) : 1;
  const totalPrice = numericPrice * totalPassengers;
  const totalPriceStr = totalPrice.toLocaleString() + '원';

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

        <div className="btn-group">
          <button className="btn-prev" onClick={() => navigate('/trains', { state: data })}>이전으로</button>
          <button className="btn-pay" onClick={() => navigate('/ticket', { state: { ...data, totalPriceStr } })}>발권하기</button>
        </div>
      </div>
    </div>
  );
}