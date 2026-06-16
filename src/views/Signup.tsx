import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../api/client';
import {
  fetchCognitoConfig,
  isMockMode,
  cognitoSignUp,
  cognitoConfirmSignUp,
  cognitoResendConfirmationCode
} from '../api/cognitoAuth';

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
  const [configLoaded, setConfigLoaded] = useState<boolean>(false);

  // 이메일 인증 단계 관리용 상태
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [registeredSub, setRegisteredSub] = useState<string>('');
  const [resending, setResending] = useState<boolean>(false);

  // Cognito 설정 로드
  useEffect(() => {
    fetchCognitoConfig()
      .then(() => setConfigLoaded(true))
      .catch((err) => {
        console.warn('Cognito 설정 로드 실패 (Mock 모드로 진행):', err);
        setConfigLoaded(true);
      });
  }, []);

  // 💡 유효성 검사 및 실시간 메시지 관리를 위한 상태 추가
  const [isIdChecked, setIsIdChecked] = useState<boolean>(false);
  const [checkedId, setCheckedId] = useState<string>('');
  const [idMessage, setIdMessage] = useState<string>('');
  const [isIdValid, setIsIdValid] = useState<boolean>(false);

  const handleVerifySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      alert('인증코드를 입력해 주세요.');
      return;
    }

    try {
      // 1. Cognito 인증코드 확인
      await cognitoConfirmSignUp(formData.email, verificationCode.trim());

      // 2. 백엔드 DB 동기화
      await apiClient.post('/api/auth/signup', {
        cognito_sub: registeredSub,
        userId: formData.userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      alert('🎉 회원가입 및 이메일 인증이 완료되었습니다! 로그인해 주세요.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      let errMsg = '이메일 인증 처리 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        errMsg = error.message;
      }
      alert(`인증 실패: ${errMsg}`);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      await cognitoResendConfirmationCode(formData.email);
      alert('📩 인증코드가 이메일로 재전송되었습니다.');
    } catch (error) {
      console.error(error);
      let errMsg = '인증코드 재전송 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        errMsg = error.message;
      }
      alert(`재전송 실패: ${errMsg}`);
    } finally {
      setResending(false);
    }
  };


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

    if (!configLoaded) {
      alert('Cognito 설정을 로드하는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    // 비밀번호 체크
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
      return;
    }

    // Cognito 비밀번호 정책 검증 (8자 이상 + 대/소문자 + 숫자 + 특수문자)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!isMockMode() && !passwordRegex.test(formData.password)) {
      alert('비밀번호는 8자 이상이며, 대문자/소문자/숫자/특수문자를 모두 포함해야 합니다.');
      return;
    }

    // 아이디 중복확인 필수 체크 장치
    if (!isIdChecked || formData.userId !== checkedId) {
      alert('아이디 중복확인을 완료해 주세요.');
      return;
    }

    try {
      if (!isMockMode()) {
        // ── Cognito 모드: Cognito User Pool에 회원가입 등록 ──
        // Cognito User Pool이 username_attributes=["email"]로 설정되어 있으므로
        // username에 email을 전달해야 합니다.
        const sub = await cognitoSignUp(
          formData.email,
          formData.password,
          formData.email,
          formData.name,
          formData.phone
        );

        setRegisteredSub(sub);
        setIsVerifying(true);
        alert('📩 입력하신 이메일로 인증 코드가 발송되었습니다. 인증 코드를 입력하여 가입을 완료해 주세요.');
      } else {
        // ── Mock 모드: 기존 백엔드 API 직접 호출 ──
        await apiClient.post('/api/auth/signup', {
          userId: formData.userId,
          password: formData.password,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        });
        alert('🎉 회원가입이 성공적으로 완료되었습니다! 로그인해 주세요.');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      let errMsg = '회원가입 처리 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        errMsg = error.message;
      }
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

      <div className="breadcrumb">
        <div className="page-path-list">
          <div className="page-path">
            <span className="ico-home"></span> 홈 &gt; 회원 &gt; 회원가입
          </div>
          <div className="print" title="인쇄" onClick={() => window.print()} style={{ cursor: 'pointer' }}></div>
        </div>
      </div>

      <div className="auth-box wide">
        <div className="cont-inner">
          <div className="content-sub-box auth-box">
            {isVerifying ? (
              <>
                <p className="sub-tit">📩 이메일 인증<br />입력하신 이메일({formData.email})로 전송된 6자리 인증 코드를 입력하세요.</p>
                <div className="login-box">
                  <form onSubmit={handleVerifySubmit}>
                    <div className="input-row">
                      <label htmlFor="verificationCode">인증 번호</label>
                      <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="6자리 인증 코드를 입력하세요"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div className="btn-group" style={{ marginTop: '20px' }}>
                      <button type="button" className="btn-cancel" onClick={handleResendCode} disabled={resending}>
                        {resending ? '재전송 중...' : '인증번호 재발송'}
                      </button>
                      <button type="submit" className="btn-ok">인증 완료</button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <>
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
                        <button type="button" onClick={handleIdCheck}>중복확인</button>
                      </div>
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
                      <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>취소</button>
                      <button type="submit" className="btn-ok">회원가입 완료</button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}