import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('로그인 시도:', { userId, password });
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>KORAIL <span>로그인</span></h1>
        <p>철도회원번호 또는 이메일로 로그인해 주세요.</p>
      </div>

      <div className="auth-box">
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

        <div className="auth-footer">
          <span className="link">아이디 찾기</span>
          <span className="bar">|</span>
          <span className="link">비밀번호 찾기</span>
          <span className="bar">|</span>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}