import { Link } from 'react-router-dom'
import './MyPostsPage.css'

function MyPostsPage() {
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

          <button className="side-menu active">
            ↪ 내가 쓴 글
          </button>

          <button className="side-menu">
            💬 내가 쓴 댓글
          </button>

          <button className="side-menu">
            ☆ 즐겨찾기
          </button>
        </aside>

        <main className="posts-main">
          <h1>내가 쓴 글</h1>

          <p>
            내가 작성한 게시글을 확인할 수 있습니다.
          </p>

          <section className="search-box">
            <select>
              <option>전체 게시판</option>
            </select>

            <input placeholder="제목을 검색하세요" />
          </section>

          <section className="table-card">
            <table>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>게시판</th>
                  <th>작성일</th>
                  <th>조회수</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>24</td>
                  <td>2024학년도 2학기 강의 추천해주세요!</td>
                  <td>자유게시판</td>
                  <td>2024.05.20</td>
                  <td>123</td>
                </tr>

                <tr>
                  <td>23</td>
                  <td>중앙도서관 좌석 추천</td>
                  <td>캠퍼스 생활</td>
                  <td>2024.05.18</td>
                  <td>98</td>
                </tr>

                <tr>
                  <td>22</td>
                  <td>기숙사 관련 질문 있습니다.</td>
                  <td>질문게시판</td>
                  <td>2024.05.15</td>
                  <td>76</td>
                </tr>

                <tr>
                  <td>21</td>
                  <td>맛집 정보 공유해요</td>
                  <td>자유게시판</td>
                  <td>2024.05.10</td>
                  <td>132</td>
                </tr>

                <tr>
                  <td>20</td>
                  <td>동아리 연합 후기</td>
                  <td>동아리</td>
                  <td>2024.05.08</td>
                  <td>64</td>
                </tr>
              </tbody>
            </table>

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
          </section>
        </main>
      </div>
    </div>
  )
}

export default MyPostsPage