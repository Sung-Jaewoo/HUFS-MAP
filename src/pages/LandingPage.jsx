import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing-page">

      {/* 상단 네비게이션 */}
      <header className="landing-nav">
        <div className="logo">
          HUFS MAP
        </div>

        <nav>
          <a href="#">캠퍼스맵</a>
          <a href="#">건물찾기</a>
          <a href="#">게시판</a>

          <Link to="/mypage">
            마이페이지
          </Link>

          <Link to="/login">
            로그인/회원가입
          </Link>
        </nav>
      </header>

      {/* 메인 배너 */}
      <section className="hero-section">
        <div className="hero-text">
          <span>
            OO대학교 캠퍼스 맵
          </span>

          <h1>
            한눈에 보는
            <br />
            <strong>우리 학교</strong>
          </h1>

          <p>
            건물 위치와 편의시설을 쉽고 빠르게 확인하고
            <br />
            필요한 정보를 편리하게 이용해보세요.
          </p>

          <button>
            지도로 시작하기 ›
          </button>
        </div>

        <div className="hero-image">
          🏫
        </div>
      </section>

      {/* 메뉴 카드 */}
      <section className="menu-section">

        <div className="menu-box">
          <div className="icon blue">
            🔍
          </div>

          <div>
            <h3>건물 검색</h3>

            <p>
              건물명을 검색하여
              <br />
              위치를 찾아보세요.
            </p>
          </div>

          <span>→</span>
        </div>

        <div className="menu-box">
          <div className="icon purple">
            📋
          </div>

          <div>
            <h3>게시판</h3>

            <p>
              공지사항과 다양한 소식을
              <br />
              확인해보세요.
            </p>
          </div>

          <span>→</span>
        </div>

        <div className="menu-box">
          <div className="icon green">
            🍴
          </div>

          <div>
            <h3>편의시설</h3>

            <p>
              식당, 카페, 행정실 등
              <br />
              주요 시설을 확인하세요.
            </p>
          </div>

          <span>→</span>
        </div>

      </section>

      {/* 지도 미리보기 */}
      <section className="map-preview">
        <div className="map-card">
          <h3>캠퍼스 지도 미리보기</h3>

          <p>
            지도를 클릭하여
            <br />
            자세히 확인해 보세요.
          </p>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="landing-footer">
        <a href="#">이용약관</a>
        <a href="#">개인정보처리방침</a>
        <a href="#">문의하기</a>
      </footer>
    </div>
  )
}

export default LandingPage