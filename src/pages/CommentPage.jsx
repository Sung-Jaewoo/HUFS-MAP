import { Link } from 'react-router-dom'
import './CommentPage.css'

function CommentPage() {
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

          <button className="side-menu active">
            💬 내가 쓴 댓글
          </button>

          <button className="side-menu">
            ☆ 즐겨찾기
          </button>
        </aside>

        <main className="posts-main">
          <h1>내가 쓴 댓글</h1>

          <p>
            내가 작성한 댓글을 확인할 수 있습니다.
          </p>

          <section className="search-box">
            <select>
              <option>전체 게시판</option>
            </select>

            <input placeholder="댓글 내용을 검색하세요" />
          </section>

          <section className="comment-list">

            <div className="comment-card">
              <div>
                <h3>중앙도서관 좌석 추천</h3>

                <p>
                  3층 창가 쪽이 조용하고 추천합니다!
                </p>

                <span>
                  자유게시판 ｜ 2024.05.18 14:30
                </span>
              </div>

              <button>원글 보기</button>
            </div>

            <div className="comment-card">
              <div>
                <h3>기숙사 관련 질문 있습니다.</h3>

                <p>
                  저도 궁금했는데, 관리실에 문의해보세요!
                </p>

                <span>
                  질문게시판 ｜ 2024.05.15 09:22
                </span>
              </div>

              <button>원글 보기</button>
            </div>

            <div className="comment-card">
              <div>
                <h3>맛집 정보 공유해요</h3>

                <p>
                  여기 정말 맛있어요 ㅎㅎ
                </p>

                <span>
                  자유게시판 ｜ 2024.05.10 18:45
                </span>
              </div>

              <button>원글 보기</button>
            </div>

            <div className="comment-card">
              <div>
                <h3>동아리 연합 후기</h3>

                <p>
                  저도 재밌게 다녀왔습니다! 다음에도 꼭 참여하고 싶어요.
                </p>

                <span>
                  동아리 ｜ 2024.05.08 16:05
                </span>
              </div>

              <button>원글 보기</button>
            </div>

          </section>

          <div className="pagination">
            <span>‹</span>

            <button className="active-page">
              1
            </button>

            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>

            <span>›</span>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CommentPage