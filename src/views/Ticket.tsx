
import { useLocation, useNavigate } from 'react-router-dom';

export default function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) return <div style={{ padding: '20px', marginTop: '160px', textAlign: 'center' }}>승차권 정보가 존재하지 않습니다.</div>;

  return (
    <div className="sub-page ticket-wrapper">
      {/* 💡 방금 SCSS에서 수정한 겹치지 않는 이름으로 변경 */}
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
            <div>• <strong>좌석 정보:</strong> 5호차 7D석 ({data.selectedSeatType} · 자동 임의배정 완료)</div>
            <div>• <strong>이용 인원:</strong> {data.passengerStr}</div>
          </div>

          <div className="t-barcode">
            <div></div>
          </div>

          <button className="btn-ok" onClick={() => navigate('/')}>확인 (홈으로 이동)</button>
        </div>
        
      </div>
    </div>
  );
}