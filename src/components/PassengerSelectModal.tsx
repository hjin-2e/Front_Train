import React, { useState } from 'react';

export interface PassengerType {
  adult: number;
  child: number;
  infant: number;
  senior: number;
}

interface PassengerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (passengerData: PassengerType) => void;
  initialPassenger: PassengerType;
}

const PassengerSelectModal: React.FC<PassengerSelectModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialPassenger,
}) => {
  // 모달 내부 임시 인원 상태 관리
  const [tempPassenger, setTempPassenger] = useState<PassengerType>({ ...initialPassenger });

  if (!isOpen) return null;

  const updateCount = (type: keyof PassengerType, operation: 'plus' | 'minus') => {
    const currentTotal = tempPassenger.adult + tempPassenger.child + tempPassenger.infant + tempPassenger.senior;
    const currentVal = tempPassenger[type];

    if (operation === 'plus') {
      if (currentTotal >= 9) {
        alert('최대 9명까지 예매 가능합니다.');
        return;
      }
      setTempPassenger((prev) => ({ ...prev, [type]: currentVal + 1 }));
    } else {
      if (currentVal <= 0) return;
      if (type === 'adult' && currentVal === 1 && currentTotal === 1) {
        alert('최소 1명의 승객은 선택되어야 합니다.');
        return;
      }
      setTempPassenger((prev) => ({ ...prev, [type]: currentVal - 1 }));
    }
  };

  const passengerConfig = [
    { type: 'adult' as const, label: '어른', desc: '만 13세 이상' },
    { type: 'child' as const, label: '어린이', desc: '만 6세 ~ 12세' },
    { type: 'infant' as const, label: '유아', desc: '만 6세 미만' },
    { type: 'senior' as const, label: '경로', desc: '만 65세 이상' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header line-dark">
          <h3>인원 선택</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <div className="passenger-list">
          {passengerConfig.map((item) => {
            const currentCount = tempPassenger[item.type];
            return (
              <div key={item.type} className="passenger-row">
                <div className="info">
                  <span className="label">{item.label}</span>
                  <span className="desc">{item.desc}</span>
                </div>
                <div className="counter">
                  <button 
                    type="button" 
                    className={currentCount === 0 ? 'disabled' : ''} 
                    onClick={() => updateCount(item.type, 'minus')}
                  >-</button>
                  <div className="num">{currentCount}</div>
                  <button type="button" onClick={() => updateCount(item.type, 'plus')}>+</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="modal-btn-wrap">
          <button className="btn-cancel" onClick={onClose}>취소</button>
          <button className="btn-submit" onClick={() => onApply(tempPassenger)}>적용</button>
        </div>
      </div>
    </div>
  );
};

export default PassengerSelectModal;