import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../api/client';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    phone: ''
  });

  // 💡 유효성 검사 및 실시간 메시지 관리를 위한 상태 추가
  const [isIdChecked, setIsIdChecked] = useState<boolean>(false); // 중복확인 완료 여부
  const [checkedId, setCheckedId] = useState<string>(''); // 중복확인 통과한 아이디 저장
  const [idMessage, setIdMessage] = useState<string>('');
  const [isIdValid, setIsIdValid] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 아이디를 타이핑하는 도중에는 다시 중복확인을 받도록 리셋
    if (name === 'userId') {
      setIsIdChecked(false);
      setIdMessage('');
    }
  };

  // 💡 1. 아이디 중복확인 핸들러
  const handleIdCheck = async () => {
    const idRegex = /^[a-zA-Z0-9]{6,15}$/; // 영문, 숫자 조합 6~15자

    if (!formData.userId.trim()) {
      alert('아이디를 입력해 주세요.');
      return;
    }

    if (!idRegex.test(formData.userId)) {
      alert('아이디는 영문, 숫자 조합의 6~15자여야 합니다.');
      return;
    }

    try {
      // 가상 데이터 또는 실제 apiClient를 활용한 비동기 중복체크
      // const response = await apiClient.get(`/api/auth/check-id?userId=${formData.userId}`);
      // const isDuplicated = response.data.isDuplicated;

      // 테스트용 가상 조건 (admin 기가입 처리 예시)
      const isDuplicated = formData.userId === 'admin' || formData.userId === 'korail123';

      if (isDuplicated) {
        setIdMessage('❌ 이미 사용 중이거나 중복된 아이디입니다.');
        setIsIdValid(false);
        setIsIdChecked(false);
      } else {
        setIdMessage('✅ 사용 가능한 아이디입니다.');
        setIsIdValid(true);
        setIsIdChecked(true);
        setCheckedId(formData.userId); // 중복확인 완료 시점의 ID 고정
      }
    } catch (error) {
      console.error(error);
      alert('서버 통신 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  // 💡 2. 비밀번호 실시간 검증 가이드 메시지 생성 함수
  const getPasswordMessage = () => {
    if (!formData.password || !formData.confirmPassword) return { text: '', color: '' };

    if (formData.password === formData.confirmPassword) {
      return { text: '✅ 비밀번호가 일치합니다.', color: '#27ae60' };
    } else {
      return { text: '❌ 비밀번호가 일치하지 않습니다.', color: '#e74c3c' };
    }
  };

  const passMsg = getPasswordMessage();

  // 💡 3. 최종 서밋(가입요청) 검증 장치
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비밀번호 체크
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
      return;
    }

    // 아이디 중복확인 필수 체크 장치
    if (!isIdChecked || formData.userId !== checkedId) {
      alert('아이디 중복확인을 완료해 주세요.');
      return;
    }

    try {
      // 백엔드 회원가입 API 호출
      await apiClient.post('/api/auth/signup', {
        userId: formData.userId,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      alert('🎉 회원가입이 성공적으로 완료되었습니다! 로그인해 주세요.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      let errMsg = '회원가입 처리 중 오류가 발생했습니다.';
      if (axios.isAxiosError(error)) {
        errMsg = error.response?.data?.message || errMsg;
      }
      alert(`회원가입 실패: ${errMsg}`);
    }
  };

  return (
    <div className="sub-page">
      <div className="sub-top">
        <div className="page-title">
          <h2>회원가입</h2>
        </div>
      </div>

      <div className="auth-box wide">
        <div className="cont-inner">
          <div className="content-sub-box auth-box">
            <p className="sub-tit">코레일 멤버십 회원이 되어 다양한 혜택을 누려보세요.</p>

            <div className="login-box">
              <form onSubmit={handleSubmit}>
                <div className="input-row">
                  <label>이름</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="홍길동" required />
                </div>

                <div className="input-row">
                  <label>아이디</label>
                  <div className="input-with-btn">
                    <input type="text" name="userId" value={formData.userId} onChange={handleChange} placeholder="영문, 숫자 조합 6~15자" required />
                    {/* 💡 중복확인 버튼 스크립트 연결 */}
                    <button type="button" onClick={handleIdCheck}>중복확인</button>
                  </div>
                  {/* 💡 아이디 중복여부 메시지 출력 */}
                  {idMessage && (
                    <p style={{ fontSize: '12px', marginTop: '6px', color: isIdValid ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                      {idMessage}
                    </p>
                  )}
                </div>

                <div className="input-row flex-row">
                  <div className="col">
                    <label>비밀번호</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호 입력" required />
                  </div>
                  <div className="col">
                    <label>비밀번호 확인</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="비밀번호 재입력" required />
                  </div>
                </div>
                {/* 💡 비밀번호 일치여부 실시간 피드백 텍스트 UI 추가 */}
                {passMsg.text && (
                  <p style={{ fontSize: '12px', marginTop: '-12px', marginBottom: '16px', color: passMsg.color, fontWeight: 'bold' }}>
                    {passMsg.text}
                  </p>
                )}

                <div className="input-row">
                  <label>이메일 주소</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@korail.com" required />
                </div>

                <div className="input-row mb-28">
                  <label>휴대폰 번호</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="010-0000-0000" required />
                </div>

                <div className="btn-group">
                  <button type="button" className="btn-cancel">취소</button>
                  <button type="submit" className="btn-ok">회원가입 완료</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}