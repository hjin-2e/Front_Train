import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/api/auth/login', {
        userId,
        password
      });

      const { cognito_sub, name } = response.data;
      
      // 로컬스토리지에 로그인 세션 및 사용자명 저장
      localStorage.setItem('cognito_sub', cognito_sub);
      localStorage.setItem('user_name', name);

      alert(`🎉 ${name}님, 환영합니다! 로그인이 완료되었습니다.`);

      // 이전 페이지(예: 예매 화면) 및 여정 상태가 존재하면 복원 이동하고, 없으면 메인(/)으로 이동
      const fromPath = location.state?.from || '/';
      const trainState = location.state?.trainState;
      navigate(fromPath, { state: trainState });
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
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

              <button type="submit" className="btn-submit">로그인</button>
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