// import { Link } from "react-router-dom";

import { useState } from "react";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (e, menuIndex) => {
    e.preventDefault(); 
    
    setActiveMenu((prev) => (prev === menuIndex ? null : menuIndex));
  };

  return (
    <header id="header">
        <div className="header-wrap">
            <div className="header-inner">
                <div className="header-top">
                  <div className="top-menu">
                    <ul>
                      <li><a href="https://info.korail.com/info/index.do">한국철도</a></li>
                      <li className="on b-n"><a href="/">승차권예매</a></li>
                      <li><a href="https://www.korail.com/tour/main">기차여행</a></li>
                    </ul>
                  </div>
                  <div className="header-info">
                    <ul className="hd-info-list">
                      <li><a href="">로그인</a></li>
                      <li><a href="">장바구니</a></li>
                      <li><a href="">마이페이지</a></li>
                      <li><a href="">고객센터</a></li>
                      <li><a href="">기업전용</a></li>
                    </ul>
                  </div>
                </div>
            </div>
            <div className="header-nav">
                <div className="header-inner nav-inner">
                    <h1 className="logo"><a href="#none" aria-label="코레일 승차권예매 메인페이지로 이동"></a></h1>
                    <nav>
                        <ul className="gnb_depth1">
                          <li>
                            <a href="" onClick={(e) => handleMenuClick(e, 0)}>승차권</a>
                            <div className={`gnb_depth2_item gnb_depth2_item1 ${activeMenu === 0 ? "active" : ""}`}>
                              <div className="gnb_bg">
                                <div className="gnb_depth2_inner">
                                  <div className="sgnb_title_txt">
                                      <span className="title">승차권</span>
                                  </div>
                                  <div className="gnb_depth2_list">
                                    <ul>
                                      <li><a href="#" className="gnb_dep3" title="">승차권 확인</a></li>
                                      <li>
                                        <a href="#" className="gnb_dep3_open" title="">예매</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="">승차권 예매</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">할인상품</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">단체승차권</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">정기승차권</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">예약승차권 조회 · 취소</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">이용내역/영수증 조회</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                      <li><a href="#" className="gnb_dep3_open" title="">반환</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="">승차권 반환</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">역구입 승차권 환불 신청</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">전화반환접수 안내</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">현금결제 승차권 계좌이체 환불 신청</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                      <li>
                                        <a href="#" className="gnb_dep3_open" title="">비회원서비스</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="">승차권 확인</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">이용내역/영수증 조회</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">지연료 계좌반환</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">외부플랫폼 영수증 출력</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                      <li>
                                        <a href="#" className="gnb_dep3_open" title="">이용안내</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="">자주찾는 질문(FAQ)</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">승차권 구매/환불/분실</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">정기승차권 구매/환불/분실</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">장바구니/전달하기</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">열차지연/운행중지</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">할인쿠폰 이용방법</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">부가운임 기준</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">기념입장권</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                      <li><a href="#" className="gnb_dep3" title="">할인제도 안내</a></li>
                                      <li><a href="#" className="gnb_dep3" title="">열차운임/시간표</a></li>
                                      <li><a href="#" className="gnb_dep3" title="">광명역 공항버스 예매</a></li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                              <a href="" onClick={(e) => handleMenuClick(e, 1)}>철도역·열차</a>
                            <div className={`gnb_depth2_item gnb_depth2_item1 ${activeMenu === 1 ? "active" : ""}`}>
                              <div className="gnb_bg">
                                <div className="gnb_depth2_inner">
                                  <div className="sgnb_title_txt">
                                      <span className="title">철도역·열차</span>
                                  </div>
                                  <div className="gnb_depth2_list">
                                    <ul>
                                      <li>
                                        <a href="#" className="gnb_dep3_open" title="">철도역 안내</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="">역 안내</a></li>
                                            <li><a href="#" className="gnb_dep4" title="새 창으로 열기" target="_blank">노선안내</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">역 편의 시설</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">회의실</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">도심공항터미널</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">승차권 제휴할인</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                      <li>
                                        <a href="#" className="gnb_dep3_open" title="">열차 안내</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="">열차 좌석배치도</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">열차 편의시설</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">열차이용에티켓</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li><a href="" onClick={(e) => handleMenuClick(e, 2)}>고객서비스</a>
                            <div className={`gnb_depth2_item gnb_depth2_item1 ${activeMenu === 2 ? "active" : ""}`}>
                              <div className="gnb_bg">
                                <div className="gnb_depth2_inner">
                                  <div className="sgnb_title_txt">
                                      <span className="title">고객서비스</span>
                                  </div>
                                  <div className="gnb_depth2_list">
                                    <ul>
                                      <li><a href="#" className="gnb_dep3" title="">공지사항</a></li>
                                      <li>
                                        <a href="#" className="gnb_dep3_open" title="">고객센터</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="새 창으로 열기">고객의 소리 접수/조회</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">철도고객센터</a></li>
                                            <li><a href="#" className="gnb_dep4" title="새 창으로 열기">서비스아이디어제안</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                      <li>
                                        <a href="#" className="gnb_dep3_open" title="">유실물 찾기</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="">유실물신고안내</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">유실물 찾기</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                      <li><a href="#" className="gnb_dep3" title="">열차서비스</a></li>
                                      <li><a href="#" className="gnb_dep3" title="">교통약자 배려서비스</a></li>
                                      <li>
                                        <a href="#" className="gnb_dep3_open" title="">전철이용안내/지연증명</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="">전철이용안내</a></li>
                                            <li><a href="#" className="gnb_dep4" title="새 창으로 열기">간편지연증명서 발급</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                      <li><a href="#" className="gnb_dep3" title="">레일플러스 교통카드</a></li>
                                      <li>
                                        <a href="#" className="gnb_dep3_open" title="">철도범죄신고</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="">철도범죄신고안내</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">암표제보</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                      <li><a href="#" className="gnb_dep3" title="새 창으로 열기">광고안내</a></li>
                                      <li><a href="#" className="gnb_dep3" title="">철도시민안전신고센터</a></li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li><a href="" onClick={(e) => handleMenuClick(e, 3)}>코레일멤버십</a>
                            <div className={`gnb_depth2_item gnb_depth2_item1 ${activeMenu === 3 ? "active" : ""}`}>
                              <div className="gnb_bg">
                                <div className="gnb_depth2_inner">
                                  <div className="sgnb_title_txt">
                                      <span className="title">코레일멤버십</span>
                                  </div>
                                  <div className="gnb_depth2_list">
                                    <ul>
                                      <li>
                                        <a href="#" className="gnb_dep3_open" title="">소개</a>
                                        <div className="gnb_dep3_list">
                                          <ul>
                                            <li><a href="#" className="gnb_dep4" title="">멤버십 소개</a></li>
                                            <li><a href="#" className="gnb_dep4" title="">멤버십 제휴소개</a></li>
                                          </ul>
                                        </div>
                                      </li>
                                      <li><a href="#" className="gnb_dep3" title="">KTX 마일리지＆회원쿠폰</a></li>
                                      <li><a href="#" className="gnb_dep3" title="">멤버십 가입신청</a></li>
                                      <li><a href="#" className="gnb_dep3" title="">예약보관금 반환접수</a></li>
                                      <li><a href="#" className="gnb_dep3" title="">러브포인트 기부</a></li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                    </nav>
                    <div className="util-wrap">
                      <button className="btn-allmenu">
                          <span className="none">전체 메뉴 열기</span>
                      </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;