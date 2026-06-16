import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../api/client';
import { fetchCognitoConfig, isMockMode, cognitoLogin } from '../api/cognitoAuth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [configLoaded, setConfigLoaded] = useState<boolean>(false);

  // 앱 시작 시 Cognito 설정 로드
  useEffect(() => {
    fetchCognitoConfig()
      .then(() => setConfigLoaded(true))
      .catch((err) => {
        console.warn('Cognito 설정 로드 실패 (Mock 모드로 진행):', err);
        setConfigLoaded(true);
      });
  }, []);

  const handleMockLogin = async () => {
    const response = await apiClient.post('/api/auth/login', {
      userId,
      password
    });

    const { cognito_sub, name } = response.data;

    localStorage.setItem('cognito_sub', cognito_sub);
    localStorage.setItem('user_name', name);

    alert(`🎉 ${name}님, 환영합니다! 로그인이 완료되었습니다.`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!isMockMode()) {
        try {
          // ── Cognito 모드: 아이디 → 이메일 변환 후 Cognito SDK 로그인 ──
          // Cognito User Pool이 username_attributes=["email"]로 설정되어 있으므로
          // 반드시 이메일 형식으로 로그인해야 합니다.
          let loginEmail = userId;

          // 이메일 형식이 아닌 경우(@가 없으면) → 백엔드 lookup API로 이메일 조회
          if (!userId.includes('@')) {
            try {
              const lookupRes = await apiClient.get('/api/auth/lookup', { params: { userId } });
              loginEmail = lookupRes.data.email;
            } catch (lookupErr) {
              console.warn("이메일 조회 실패. 서버 모드 전환 여부를 확인합니다.", lookupErr);
              const newConfig = await fetchCognitoConfig(true);
              if (newConfig.mockMode) {
                console.log("서버가 DR(Mock) 모드로 전환됨이 감지되었습니다. 일반 로그인을 시도합니다.");
                await handleMockLogin();
                
                const fromPath = location.state?.from || '/';
                const trainState = location.state?.trainState;
                navigate(fromPath, { state: trainState });
                return;
              }
              alert('가입되지 않은 아이디입니다.');
              return;
            }
          }

          console.log("🔍 [Cognito Login] 로그인 이메일:", loginEmail);
          const result = await cognitoLogin(loginEmail, password);

          // 실제 JWT와 유저 정보 저장
          localStorage.setItem('cognito_id_token', result.idToken);
          localStorage.setItem('cognito_sub', result.sub);
          localStorage.setItem('user_name', result.name);

          // 백엔드 DB에 유저 정보 동기화 (최초 로그인 시 DB에 없을 수 있으므로)
          try {
            await apiClient.post('/api/auth/signup', {
              cognito_sub: result.sub,
              email: result.email,
              name: result.name,
              userId: userId // 일반 아이디 동기화용 추가
            });
          } catch {
            // 이미 등록된 유저면 무시
          }

          alert(`🎉 ${result.name}님, 환영합니다! 로그인이 완료되었습니다.`);
        } catch (cognitoErr) {
          console.warn("Cognito 로그인 중 에러 발생. 최신 서버 구성을 다시 점검합니다:", cognitoErr);
          
          // 백엔드로부터 최신 서버 설정을 동적으로 재확인
          const newConfig = await fetchCognitoConfig(true);
          
          if (newConfig.mockMode) {
            console.log("서버가 DR(Mock) 모드로 전환됨이 감지되었습니다. 일반 로그인을 시도합니다.");
            await handleMockLogin();
            
            const fromPath = location.state?.from || '/';
            const trainState = location.state?.trainState;
            navigate(fromPath, { state: trainState });
            return;
          }
          
          // 진짜 로그인 에러인 경우 상위 catch로 던져 에러 팝업 발생시킴
          throw cognitoErr;
        }
      } else {
        await handleMockLogin();
      }

      // 이전 페이지(예: 예매 화면) 및 여정 상태가 존재하면 복원 이동하고, 없으면 메인(/)으로 이동
      const fromPath = location.state?.from || '/';
      const trainState = location.state?.trainState;
      navigate(fromPath, { state: trainState });
    } catch (error) {
      console.error(error);
      let errMsg = '로그인 중 오류가 발생했습니다.';

      if (error instanceof Error) {
        // Cognito SDK 에러 메시지 처리
        const msg = error.message;
        if (msg.includes('Incorrect username or password')) {
          errMsg = '아이디 또는 비밀번호가 올바르지 않습니다.';
        } else if (msg.includes('User does not exist')) {
          errMsg = '가입되지 않은 사용자입니다.';
        } else if (msg.includes('User is not confirmed')) {
          errMsg = '이메일 인증이 완료되지 않은 계정입니다.';
        } else {
          errMsg = msg;
        }
      }
      if (axios.isAxiosError(error)) {
        errMsg = error.response?.data?.message || errMsg;
      }
      alert(`로그인 실패: ${errMsg}`);
    }
  };

  return (
    <div className="sub-page">
      <div className="sub-top">
        <div className="page-title">
          <h2>로그인</h2>
        </div>
      </div>

      <div className="breadcrumb">
        <div className="page-path-list">
          <div className="page-path">
            <span className="ico-home"></span> 홈 &gt; 회원 &gt; 로그인
          </div>
          <div className="print" title="인쇄" onClick={() => window.print()} style={{ cursor: 'pointer' }}></div>
        </div>
      </div>

      <div className="cont-inner">
        <div className="content-sub-box auth-box">
          <p className="sub-tit">코레일멤버십<br />회원번호로 로그인하세요.</p>

          <div className="login-box">
            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <label htmlFor="userId">사용자 ID / 회원번호</label>
                <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디를 입력하세요" required />
              </div>

              <div className="input-row">
                <label htmlFor="password">비밀번호</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" required />
              </div>

              <button type="submit" className="btn-submit" disabled={!configLoaded}>
                {configLoaded ? '로그인' : '설정 로드 중...'}
              </button>
            </form>
          </div>

          <div className="auth-footer">
            <span className="link">아이디 찾기</span>
            <span className="bar">|</span>
            <span className="link">비밀번호 찾기</span>
            <span className="bar">|</span>
            <Link to="/signup">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}