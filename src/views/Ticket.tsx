
import { useLocation, useNavigate } from 'react-router-dom';

export default function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) return <div style={{ padding: '20px', marginTop: '160px', textAlign: 'center' }}>승차권 정보가 존재하지 않습니다.</div>;

  // passengerStr(예: "어른 9명")에서 총 인원수 계산
  const passengerCounts = data.passengerStr?.match(/\d+(?=명)/g);
  const totalPassengers = passengerCounts ? passengerCounts.reduce((acc: number, cur: string) => acc + parseInt(cur, 10), 0) : 1;

  // 멱등성(Purity)을 유지하기 위해 열차 번호를 시드로 사용하여 좌석 번호를 결정론적으로 계산 (Math.random 제거)
  const trainNumber = parseInt(data.selectedTrain?.number || '101', 10) || 101;
  const carNum = (trainNumber % 5) + 1; // 1~5호차
  const startRow = ((trainNumber * 7) % 10) + 1; // 1~10열부터 시작
  const seatLetters = ['A', 'B', 'C', 'D'];

  const seatsList = [];
  for (let i = 0; i < totalPassengers; i++) {
    const currentRow = startRow + Math.floor(i / 4);
    const seatLetter = seatLetters[i % 4];
    seatsList.push(`${currentRow}${seatLetter}`);
  }

  const seatInfo = `${carNum}호차 ${seatsList.join(', ')}석`;

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