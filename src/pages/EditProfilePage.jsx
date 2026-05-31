import { Link } from 'react-router-dom'
import './EditProfilePage.css'

function EditProfilePage() {
  return (
    <div className="mypage">
      <header className="top-nav">
        <Link to="#">캠퍼스맵</Link>
        <Link to="#">게시판</Link>
        <Link to="/mypage">마이페이지</Link>
        <Link to="/">로그인</Link>
      </header>

      <div className="mypage-layout">
        <aside className="mypage-sidebar">
          <div className="side-profile">
            <div className="side-avatar">👤</div>

            <div>
              <strong>홍길동</strong>
              <span>학생</span>
              <p>컴퓨터공학과</p>
              <p>honggildong@ooo.ac.kr</p>
            </div>
          </div>

          <button className="side-menu active">✎ 정보 수정</button>
          <button className="side-menu">↪ 내가 쓴 글</button>
          <button className="side-menu">💬 내가 쓴 댓글</button>
          <button className="side-menu">☆ 즐겨찾기</button>
        </aside>

        <main className="edit-main">
          <h1>정보 수정</h1>
          <p>개인 정보를 변경할 수 있습니다.</p>

          <section className="edit-card">
            <div className="edit-row">
              <label>이름</label>
              <input defaultValue="홍길동" />
            </div>

            <div className="edit-row">
              <label>소속</label>
              <input defaultValue="컴퓨터공학과" />
            </div>

            <div className="edit-row">
              <label>이메일</label>
              <input defaultValue="honggildong@ooo.ac.kr" />
            </div>

            <div className="edit-row password">
              <label>비밀번호 변경</label>

              <div>
                <input type="password" placeholder="현재 비밀번호 입력" />
                <input type="password" placeholder="새 비밀번호 입력" />
                <input type="password" placeholder="새 비밀번호 확인" />
              </div>
            </div>

            <div className="edit-buttons">
              <Link to="/mypage" className="cancel-btn">
                취소
              </Link>

              <button className="save-btn">저장하기</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default EditProfilePage