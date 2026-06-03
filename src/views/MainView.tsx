import React from 'react';
import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

const MainView: React.FC = () => {
  const IMAGES = useOutletContext<Record<string, string>>();

  return (
    <div className="main">
      <div className="main-visual">
        <div className="visual-slide-wrapper">
          <Swiper
          modules={[Autoplay, EffectFade]}
          effect={'fade'}
          speed={3000}
          autoplay={{
            delay: 3000, 
            disableOnInteraction: false,
          }}
          loop={true} 
          className="main-swiper">
            <SwiperSlide><img src={IMAGES['main.jpg']} alt="main_slide01" /></SwiperSlide>
            <SwiperSlide><img src={IMAGES['main02.jpg']} alt="main_slide02" /></SwiperSlide>
            <SwiperSlide><img src={IMAGES['main03.jpg']} alt="main_slide03" /></SwiperSlide>
          </Swiper>
          <div className="event-pop">
            <div className="event-layer">
              <div className="pop_box">
                <a href="https://www.korail.com/ticket/discountSystem/child" target="_self" title="열기">
                  <img src={IMAGES['main_pop.jpg']} alt="나에게 딱 맞는 할인상품 찾기" />
                </a>
              </div>
              <div className="myPage">
                <ul>
                  <li><a href="/ticket/search/general">승차권 예매</a></li>
                  <li><a href="/ticket/myticket/list">승차권 확인</a></li>
                  <li><a href="/ticket/reservation/list">예약승차권 조회/취소</a></li>
                  <li><a href="/ticket/guest/csc/korailcs">고객센터</a></li>
                  <li><a href="/ticket/reserve/guide/faq">자주찾는 질문(FAQ)</a></li>
                  <li><a href="/ticket/reserve/guide/pay">승차권 환불 위약금</a></li>
                  <li><a href="/ticket/train/trainGuide/etiquette">열차 내 물품 휴대 기준</a></li>
                  <li><a href="/ticket/membership/certify">예약보관금 반환접수</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 간편 예매 */}
        <div className="ticket-box">
          <div className="ticket-wrap">
            <div className="start">
              <label htmlFor="labelstart" className="label">출발역</label>
              <div className="write-wrap">
                <input type="text" id="labelstart" value={'서울'} />
                <a href="#none" className="btn_pop"></a>
              </div>
            </div>
            <div className="end">
              <label htmlFor="labelend" className="label">도착역</label>
              <div className="write-wrap">
                <input type="text" id="labelend" value={'부산'} />
                <a href="#none" className="btn_pop"></a>
              </div>
            </div>
            <div className="day_start">
              <label htmlFor="labelday" className="label">출발일</label>
              <div className="write-wrap">
                <input type="text" id="labelday" />
                <a href="#none" className="btn_pop"></a>
              </div>
            </div>
            <div className="total">
              <label htmlFor="labelple" className="label">인원</label>
              <div className="write-wrap">
                <input type="text" id="labelple" />
                <a href="#none" className="btn_pop"></a>
              </div>
            </div>
            <a className="btn_lookup" href="">열차 조회하기</a>
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="contents-wrap">
        <section>
          <h2 className="tit">코레일은 <strong>다양한 할인상품</strong>으로 고객에게 다가가고 있습니다.</h2>
          <div className="cont-inner">
            <Swiper 
              slidesPerView={5}
              spaceBetween={30}
              loop={true}
              pagination={{
                clickable: true,
              }}
              navigation={true} modules={[Navigation]} className="slideSwiper pdt-list">
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/internet">인터넷 특가</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/discount">공공할인</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/childern">다자녀 행복</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/KTX">맘편한 KTX</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/cheerUp">힘내라 청춘</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/youth">청소년 드림</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/child">영업할인 공통안내</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/4people">4인동반석</a></SwiperSlide>
              <SwiperSlide><a href="https://www.korail.com/ticket/discountSystem/Ncard2">N카드(KTX,새마을)</a></SwiperSlide>
            </Swiper>
          </div>
        </section>

        {/* 열차 이용 서비스 */}
        <section>
          <div className="imgbox">
            <div>
              <div><img src={IMAGES['main_cont01.png']} alt="컨텐츠이미지" /></div>
              <div><img src={IMAGES['main_cont02.png']} alt="컨텐츠이미지2" /></div>
            </div>
          </div>
        </section>

        {/* 종합 이용 가이드 */}
        <section>
          <div className="grid_wrap">
            <div className="grid_box">
              <h4 className="title">종합 이용 가이드</h4>
              <ul className="fl-cl">
                <li>
                  <a href="https://www.korail.com/ticket/reserve/guide/faq">
                    <span className="icoWrap"></span>
                    <span className="s_tit">승차권<br />이용안내</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.korail.com/ticket/train/stationGuide/terminal">
                    <span className="icoWrap"></span>
                    <span className="s_tit">광명역<br />도심공항터미널</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.korail.com/ticket/discountSystem">
                    <span className="icoWrap"></span>
                    <span className="s_tit">할인제도</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.korail.com/ticket/guest/lost/register">
                    <span className="icoWrap"></span>
                    <span className="s_tit">유실물</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.korail.com/ticket/train/stationGuide/store/info">
                    <span className="icoWrap"></span>
                    <span className="s_tit">승차권<br />제휴할인</span>
                  </a>
                </li>
                <li>
                  <a href="/ticket/reserve/train-timeTable">
                    <span className="icoWrap"></span>
                    <span className="s_tit">열차운임/<br />시간표</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* 공지사항 */}
      <div className="notice-wrap">
        <div className="cont-inner">
          <div className="notice-head">
            <h4>공지사항</h4>
            <a href="" className="btnMore">더보기</a>
          </div>
          <ul className="notice-list">
            <li>
              <a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank">
                <p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p>
                <span className="data">2026-04-30</span>
              </a>
            </li>
            <li>
              <a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank">
                <p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p>
                <span className="data">2026-04-30</span>
              </a>
            </li>
            <li>
              <a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank">
                <p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p>
                <span className="data">2026-04-30</span>
              </a>
            </li>
            <li>
              <a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank">
                <p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p>
                <span className="data">2026-04-30</span>
              </a>
            </li>
            <li>
              <a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank">
                <p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p>
                <span className="data">2026-04-30</span>
              </a>
            </li>
            <li>
              <a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank">
                <p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p>
                <span className="data">2026-04-30</span>
              </a>
            </li>
            <li>
              <a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank">
                <p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p>
                <span className="data">2026-04-30</span>
              </a>
            </li>
            <li>
              <a href="https://www.korail.com/ticket/guest/notice/24404" target="_blank">
                <p className="s-tit">정선아리랑열차 정선선 운행 재개 및 구간 조정 알림</p>
                <span className="data">2026-04-30</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainView;