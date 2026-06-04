import React, { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({ userId: '', password: '', confirmPassword: '', name: '', email: '', phone: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.'); return;
    }
    console.log('회원가입 데이터 전송:', formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>KORAIL <span>회원가입</span></h1>
        <p>코레일 멤버십 회원이 되어 다양한 혜택을 누려보세요.</p>
      </div>

      <div className="auth-box wide">
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <label>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="홍길동" required />
          </div>

          <div className="input-row">
            <label>아이디</label>
            <div className="input-with-btn">
              <input type="text" name="userId" value={formData.userId} onChange={handleChange} placeholder="영문, 숫자 조합 6~15자" required />
              <button type="button">중복확인</button>
            </div>
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
  );
}