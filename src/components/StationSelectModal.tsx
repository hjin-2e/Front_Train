import React, { useState } from 'react';

interface StationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (station: string) => void;
  startStation: string;
  endStation: string;
}

// 검색창 부분
const getChosung = (str: string) => {
  const cho = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
    'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ];
  let result = "";
  
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code >= 0 && code <= 11172) {
      result += cho[Math.floor(code / 588)];
    } else {
      result += str.charAt(i);
    }
  }
  return result;
};

const StationSelectModal: React.FC<StationSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  startStation,
  endStation,
}) => {
  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState<string>('');
    
  if (!isOpen) return null;

  // 기차역 목록 데이터
  const majorStations = ['서울', '대전', '대구', '부산'];

  // 검색어 필터링 로직 (일반 텍스트 + 초성 검색 대응)
  const filteredStations = majorStations.filter((station) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    
    if (!normalizedQuery) return true;

    // 초성만 입력되었을 때 (예: ㅅㅇ, ㄷㅈ)
    if (normalizedQuery.match(/^[ㄱ-ㅎ]+$/)) {
      return getChosung(station).includes(normalizedQuery);
    }
    
    // 일반 글자 입력 시 (예: 서울, 대전)
    return station.toLowerCase().includes(normalizedQuery);
  });

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header line">
          <h3>기차역 조회</h3>
          <button className="btn-close" onClick={handleClose}>&times;</button>
        </div>
        
        {/* 검색창 입력 제어 영역 */}
        <div className="search-input-bar" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="역 이름 또는 초성 검색(서울 : ㅅㅇ)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingRight: '30px' }}
            autoFocus
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')} 
              style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* 필터링된 역 목록 또는 결과 없음 안내 */}
        <div className="station-grid">
          {filteredStations.length > 0 ? (
            filteredStations.map((station) => (
              <button 
                key={station}
                className={`station-btn ${startStation === station || endStation === station ? 'active' : ''}`}
                onClick={() => {
                  onSelect(station);
                  setSearchQuery('');
                }}
              >
                {station}
              </button>
            ))
          ) : (
            <div className="no-result">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationSelectModal;