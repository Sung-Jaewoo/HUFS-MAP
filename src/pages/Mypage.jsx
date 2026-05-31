import { Link } from 'react-router-dom'
import './Mypage.css'

function MyPage() {
  return (
    <div className="mypage">
      <header className="top-nav">
        <Link to="/">메인페이지</Link>
        <Link to="#">게시판</Link>
        <Link to="/mypage">마이페이지</Link>
        <Link to="/">로그인</Link>
      </header>

      <main className="mypage-main">
        <h1>마이페이지</h1>

        <p className="subtitle">
          00대학교 캠퍼스 맵을 이용해주셔서 감사합니다.
        </p>

        <section className="profile-card">
          <div className="avatar">👤</div>

          <div className="profile-info">
            <div className="name-row">
              <strong>홍길동</strong>
              <span>학생</span>
            </div>

            <p>컴퓨터공학과</p>
            <p>honggildong@ooo.ac.kr</p>
          </div>

          <Link to="/mypage/edit">
            <button className="edit-btn">
              ✎ 정보 수정
            </button>
          </Link>
        </section>

        <section className="card-grid">

          {/* 내가 쓴 글 */}
          <Link
            to="/mypage/posts"
            className="menu-link"
          >
            <div className="menu-card">
              <div className="icon blue">✎</div>

              <div className="card-text">
                <h3>내가 쓴 글</h3>

                <p>
                  내가 작성한 게시글을
                  <br />
                  확인해보세요.
                </p>
              </div>

              <b>›</b>
            </div>
          </Link>

          <Link to="/mypage/comments" className="menu-link">
          {/* 내가 쓴 댓글 */}
          <div className="menu-card">
            <div className="icon purple">💬</div>

            <div className="card-text">
              <h3>내가 쓴 댓글</h3>

              <p>
                내가 작성한 댓글을
                <br />
                확인해보세요.
              </p>
            </div>

            <b>›</b>
          </div>
          </Link>
        </section>

        <Link to="/mypage/favorites" className="menu-link">
          <section className="menu-card wide">
            <div className="icon green">☆</div>

            <div className="card-text">
              <h3>즐겨찾기</h3>

              <p>
                즐겨찾기한 건물과 장소를
                <br />
                한눈에 확인해보세요.
              </p>
            </div>

            <b>›</b>
          </section>
        </Link>

        <section className="bottom-grid">
          <div className="small-card">
            <span>↪ 로그아웃</span>
            <b>›</b>
          </div>

          <div className="small-card danger">
            <span>⚤ 탈퇴하기</span>
            <b>›</b>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MyPage
