import { Link } from 'react-router-dom'
import './FavoritePage.css'

function FavoritePage() {
  return (
    <div className="posts-page">
      <header className="top-nav">
        <Link to="#">캠퍼스맵</Link>
        <Link to="#">게시판</Link>
        <Link to="/mypage">마이페이지</Link>
        <Link to="/">로그아웃</Link>
      </header>

      <div className="posts-layout">
        <aside className="posts-sidebar">
          <div className="side-profile">
            <div className="side-avatar">👤</div>

            <div>
              <strong>홍길동</strong>
              <span>학생</span>

              <p>컴퓨터공학과</p>
              <p>honggildong@ooo.ac.kr</p>
            </div>
          </div>

          <Link to="/mypage/edit" className="side-link">
            <button className="side-menu">
              ✎ 정보 수정
            </button>
          </Link>

          <Link to="/mypage/posts" className="side-link">
            <button className="side-menu">
              ↪ 내가 쓴 글
            </button>
          </Link>

          <Link to="/mypage/comments" className="side-link">
            <button className="side-menu">
              💬 내가 쓴 댓글
            </button>
          </Link>

          <button className="side-menu active">
            ☆ 즐겨찾기
          </button>
        </aside>

        <main className="posts-main">
          <h1>즐겨찾기</h1>

          <p>
            즐겨찾기한 건물과 장소를 확인할 수 있습니다.
          </p>

          <section className="favorite-grid">

            <div className="favorite-card">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585"
                alt=""
              />

              <div className="favorite-info">
                <h3>학생회관</h3>

                <span>학생지원</span>

                <p>
                  학생 복지 및 다양한 학생 지원 프로그램을 제공하는 공간
                </p>

                <button>지도에서 보기 ›</button>
              </div>
            </div>

            <div className="favorite-card">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72"
                alt=""
              />

              <div className="favorite-info">
                <h3>백년관</h3>

                <span>학생지원</span>

                <p>
                  학생회 및 학생활동 지원 공간
                </p>

                <button>지도에서 보기 ›</button>
              </div>
            </div>

            <div className="favorite-card">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
                alt=""
              />

              <div className="favorite-info">
                <h3>공학관</h3>

                <span>공학 · 실험</span>

                <p>
                  공학계열 강의실과 실험실 공간
                </p>

                <button>지도에서 보기 ›</button>
              </div>
            </div>

            <div className="favorite-card">
              <img
                src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2"
                alt=""
              />

              <div className="favorite-info">
                <h3>도서관</h3>

                <span>도서관</span>

                <p>
                  다양한 자료를 제공하는 중앙 도서관
                </p>

                <button>지도에서 보기 ›</button>
              </div>
            </div>

          </section>
        </main>
      </div>
    </div>
  )
}

export default FavoritePage