// import { Link } from "react-router-dom";

const Header = () => {
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
                                <a href="">승차권</a>
                                <div className="gnb_depth2_item gnb_depth2_item1">
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
                            <li><a href="">철도역·열차</a></li>
                            <li><a href="">고객서비스</a></li>
                            <li><a href="">코레일멤버십</a></li>
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