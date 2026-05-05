import { IMAGES } from '../assets/images';

const Footer = () => {
  return (
    <footer>
        <div className="footer-wrap">
            <div className="ft-info-wrap">
                <div className="inner">
                    <ul className="ft-info">
                        <li><a href="">이용약관</a></li>
                        <li><a href="">여객운송약관 및 부속약관</a></li>
                        <li className="privacy"><a href="">개인정보처리방침</a></li>
                        <li><a href="">이메일무단수집거부</a></li>
                        <li><a href="">저작권정책</a></li>
                        <li><a href="">지원 브라우저 안내</a></li>
                    </ul>
                    <div className="ft_sns_share">
                        <ul className="ft_sns_list">
                          <li>
                            <a href="https://www.youtube.com/c/한국철도TV" target="_blank" rel="noreferrer" title="코레일 유튜브 (새창으로 열림)">
                              <img src={IMAGES['footer_sns_youtube.png']} alt="코레일 유튜브" />
                            </a>
                          </li>
                          <li>
                            <a href="https://www.facebook.com/KoreaRailroad" target="_blank" rel="noreferrer" title="코레일 페이스북 (새창으로 열림)">
                              <img src={IMAGES['footer_sns_facebook.png']} alt="코레일 페이스북" />
                            </a>
                          </li>
                          <li>
                            <a href="https://www.instagram.com/korail_official_/" target="_blank" rel="noreferrer" title="코레일 인스타 (새창으로 열림)">
                              <img src={IMAGES['footer_sns_insta.png']} alt="코레일 인스타" />
                            </a>
                          </li>
                          <li>
                            <a href="https://blog.naver.com/korailblog" target="_blank" rel="noreferrer" title="코레일 블로그 (새창으로 열림)">
                              <img src={IMAGES['footer_sns_blog.png']} alt="코레일 블로그" />
                            </a>
                          </li>
                          <li>
                            <a href="https://twitter.com/korail_official" target="_blank" rel="noreferrer" title="코레일 트위터 (새창으로 열림)">
                              <img src={IMAGES['footer_sns_twitter.png']} alt="코레일 트위터" />
                            </a>
                          </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="ft-site-area">
                <div className="inner">
                    <div className="ft-site-info">
                        <div className="ft-info-list">
                            <ol>
                                <li>상호 : 한국철도공사</li>
                                <li>사업자등록 : 314-82-10024</li>
                                <li>통신판매업신고 : 대전 동구 - 0233호</li>
                            </ol>
                        </div>
                        <div className="ft-info-list">
                            <ol>
                                <li>34618 대전광역시 동구 중앙로 240</li>
                                <li>대표전화 : 1588-7788</li>
                                <li>팩스번호 02-361-8385</li>
                                <li>대표이메일 : service@korail.coms</li>
                            </ol>
                        </div>
                        <p className="copyright">COPYRIGHT(C) KOREA RAILROAD. ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;