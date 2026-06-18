
import { useLocation, useNavigate } from 'react-router-dom';

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

export default function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) return <div style={{ padding: '20px', marginTop: '160px', textAlign: 'center' }}>승차권 정보가 존재하지 않습니다.</div>;

  // passengerStr(예: "어른 9명")에서 총 인원수 계산
  const passengerCounts = data.passengerStr?.match(/\d+(?=명)/g);
  const totalPassengers = passengerCounts ? passengerCounts.reduce((acc: number, cur: string) => acc + parseInt(cur, 10), 0) : 1;

  // MyTicketList와 동일한 UUID 해시 기반 좌석 번호 매핑 (데이터 정합성 일치)
  const seatInfo = generateSeatStr(data.reservationId, totalPassengers);

  return (
    <div className="sub-page ticket-wrapper">
      <div className="sub-top">
        <div className="page-title">
          <h2>승차권 조회</h2>
        </div>
      </div>

      <div className="breadcrumb">
        <div className="page-path-list">
          <div className="page-path">
            <span className="ico-home"></span> 홈 &gt; 예매 &gt; 승차권 발권
          </div>
          <div 
            className="print" 
            title="인쇄" 
            onClick={() => window.print()} 
            style={{ cursor: 'pointer' }}
          ></div>
        </div>
      </div>

      {/* 💡 방금 SCSS에서 수정한 겹치지 않는 이름으로 변경 */}
      <div className="cont-inner">
        <div className="content-sub-box">
          <div className="digital-ticket-box">
            <div className="ticket-header">
              <h4>KORAIL 디지털 승차권</h4>
            </div>

            <div className="ticket-body">
              <div className="t-route-box">
                <div className="station">
                  <span className="lbl">출발</span>
                  <span className="st">{data.startStation}</span>
                  <span className="tm blue">{data.selectedTrain?.depTime}</span>
                </div>
                <div className="arr">➔</div>
                <div className="station">
                  <span className="lbl">도착</span>
                  <span className="st">{data.endStation}</span>
                  <span className="tm">{data.selectedTrain?.arrTime}</span>
                </div>
              </div>

              <div className="t-detail-box">
                <div>• <strong>열차 종류:</strong> {data.selectedTrain?.type} (제 {data.selectedTrain?.number}열차)</div>
                <div>• <strong>좌석 정보:</strong> {seatInfo} ({data.selectedSeatType} · 자동 임의배정 완료)</div>
                <div>• <strong>이용 인원:</strong> {data.passengerStr}</div>
              </div>

              <div className="t-barcode">
                <div></div>
              </div>

              <button className="btn-ok" onClick={() => navigate('/')}>확인 (홈으로 이동)</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}