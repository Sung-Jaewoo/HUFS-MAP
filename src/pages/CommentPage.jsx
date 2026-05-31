import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./CommentPage.css";

const currentUser = {
  name: "홍길동",
  role: "학생",
  department: "컴퓨터공학과",
  email: "honggildong@ooo.ac.kr",
};

const mockComments = [
  {
    id: 1,
    postTitle: "중앙도서관 좌석 추천",
    board: "자유게시판",
    content: "3층 창가 쪽이 조용해서 추천합니다.",
    createdAt: "2024.05.18 14:30",
    postDeleted: false,
  },
  {
    id: 2,
    postTitle: "기숙사 관련 질문 있습니다.",
    board: "질문게시판",
    content: "관리실에 먼저 문의해보는 게 가장 빠릅니다.",
    createdAt: "2024.05.15 09:22",
    postDeleted: false,
  },
  {
    id: 3,
    postTitle: "맛집 정보 공유해요",
    board: "자유게시판",
    content: "여기 정말 맛있어요.",
    createdAt: "2024.05.10 18:45",
    postDeleted: false,
  },
  {
    id: 4,
    postTitle: "동아리 모집 후기",
    board: "동아리",
    content: "다음에도 꼭 참여하고 싶어요.",
    createdAt: "2024.05.08 16:05",
    postDeleted: true,
  },
];

function CommentPage() {
  const [boardFilter, setBoardFilter] = useState("전체 게시판");
  const [keyword, setKeyword] = useState("");
  const [comments, setComments] = useState(mockComments);

  const boards = useMemo(
    () => ["전체 게시판", ...new Set(mockComments.map((comment) => comment.board))],
    [],
  );

  const filteredComments = comments.filter((comment) => {
    const matchesBoard = boardFilter === "전체 게시판" || comment.board === boardFilter;
    const searchText = `${comment.postTitle} ${comment.content}`.toLowerCase();
    const matchesKeyword = searchText.includes(keyword.trim().toLowerCase());

    return matchesBoard && matchesKeyword;
  });

  const removeComment = (commentId) => {
    if (window.confirm("이 댓글을 목록에서 삭제하시겠습니까?")) {
      setComments((current) => current.filter((comment) => comment.id !== commentId));
    }
  };

  return (
    <div className="posts-page">
      <Header />

      <div className="posts-layout">
        <Sidebar active="comments" />

        <main className="posts-main">
          <h1>내가 쓴 댓글</h1>

          <p>작성한 댓글을 검색하고, 원글 이동과 삭제 흐름을 미리 확인할 수 있습니다.</p>

          <section className="search-box">
            <select value={boardFilter} onChange={(event) => setBoardFilter(event.target.value)}>
              {boards.map((board) => (
                <option key={board}>{board}</option>
              ))}
            </select>

            <input
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="댓글 내용이나 원글 제목을 검색하세요"
              value={keyword}
            />
          </section>

          <section className="comment-list">
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <article className="comment-card" key={comment.id}>
                  <div>
                    <h3>{comment.postDeleted ? "삭제된 게시글" : comment.postTitle}</h3>

                    <p>{comment.content}</p>

                    <span>
                      {comment.board} · {comment.createdAt}
                    </span>
                  </div>

                  <div className="comment-actions">
                    <Link
                      aria-disabled={comment.postDeleted}
                      className={`outline-action ${comment.postDeleted ? "disabled" : ""}`}
                      to={comment.postDeleted ? "#" : "/post"}
                    >
                      원글 보기
                    </Link>
                    <button onClick={() => removeComment(comment.id)} type="button">
                      삭제
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState text="조건에 맞는 댓글이 없습니다." />
            )}
          </section>

          <div className="pagination">
            <button disabled type="button">
              이전
            </button>
            <button className="active-page" type="button">
              1
            </button>
            <button disabled type="button">
              다음
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="top-nav">
      <Link to="/">캠퍼스맵</Link>
      <Link to="/post">게시판</Link>
      <Link to="/mypage">마이페이지</Link>
      <Link to="/">로그아웃</Link>
    </header>
  );
}

function Sidebar({ active }) {
  return (
    <aside className="posts-sidebar">
      <div className="side-profile">
        <div className="side-avatar">홍</div>

        <div>
          <strong>{currentUser.name}</strong>
          <span>{currentUser.role}</span>
          <p>{currentUser.department}</p>
          <p>{currentUser.email}</p>
        </div>
      </div>

      <Link className={`side-menu ${active === "edit" ? "active" : ""}`} to="/mypage/edit">
        회원 정보 수정
      </Link>
      <Link className={`side-menu ${active === "posts" ? "active" : ""}`} to="/mypage/posts">
        내가 쓴 글
      </Link>
      <Link className={`side-menu ${active === "comments" ? "active" : ""}`} to="/mypage/comments">
        내가 쓴 댓글
      </Link>
      <Link className={`side-menu ${active === "favorites" ? "active" : ""}`} to="/mypage/favorites">
        즐겨찾기
      </Link>
    </aside>
  );
}

function EmptyState({ text }) {
  return <div className="empty-state">{text}</div>;
}

export default CommentPage;
