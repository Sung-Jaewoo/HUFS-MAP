import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteCommentDocument, listMyComments } from "../services/board";
import { getCurrentUser, logout } from "../services/auth";
import { toKoreanErrorMessage } from "../services/errors";
import "./CommentPage.css";

function CommentPage() {
  const navigate = useNavigate();
  const [boardFilter, setBoardFilter] = useState("전체");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadComments = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        setComments(await listMyComments({ currentUserId: currentUser.$id }));
      } catch (loadError) {
        setError(toKoreanErrorMessage(loadError, "내가 쓴 댓글을 불러오지 못했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [navigate]);

  const boards = useMemo(
    () => ["전체", ...new Set(comments.map((comment) => comment.board || "게시판"))],
    [comments],
  );

  const filteredComments = comments.filter((comment) => {
    const board = comment.board || "게시판";
    const matchesBoard = boardFilter === "전체" || board === boardFilter;
    const searchText = `${comment.postTitle} ${comment.content}`.toLowerCase();
    const matchesKeyword = searchText.includes(keyword.trim().toLowerCase());

    return matchesBoard && matchesKeyword;
  });

  const handleLogout = async () => {
    await logout().catch(() => {});
    navigate("/login");
  };

  const removeComment = async (commentId) => {
    const targetComment = comments.find((comment) => comment.id === commentId);

    if (!targetComment || !window.confirm("이 댓글을 삭제하시겠습니까?")) return;

    try {
      const deletedComment = await deleteCommentDocument({ comment: targetComment });

      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, ...deletedComment, postTitle: comment.postTitle }
            : comment,
        ),
      );
    } catch (deleteError) {
      window.alert(toKoreanErrorMessage(deleteError, "댓글을 삭제하지 못했습니다."));
    }
  };

  return (
    <div className="posts-page">
      <Header onLogout={handleLogout} />

      <div className="posts-layout">
        <Sidebar active="comments" user={user} />

        <main className="posts-main">
          <h1>내가 쓴 댓글</h1>
          <p>내가 작성한 댓글을 확인하고 관리할 수 있습니다.</p>

          <section className="search-box">
            <select
              onChange={(event) => setBoardFilter(event.target.value)}
              value={boardFilter}
            >
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
            {isLoading ? (
              <EmptyState text="내가 쓴 댓글을 불러오는 중입니다." />
            ) : error ? (
              <EmptyState text={error} />
            ) : filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <article className="comment-card" key={comment.id}>
                  <div>
                    <h3>{comment.postDeleted ? "삭제된 게시글" : comment.postTitle}</h3>
                    <p>{comment.deleted ? "삭제된 댓글입니다." : comment.content}</p>
                    <span>
                      {comment.board} · {formatDateTime(comment.createdAt)}
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
                    {!comment.deleted && (
                      <button onClick={() => removeComment(comment.id)} type="button">
                        삭제
                      </button>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <EmptyState text="조건에 맞는 댓글이 없습니다." />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function Header({ onLogout }) {
  return (
    <header className="top-nav">
      <Link to="/">메인페이지</Link>
      <Link to="/post">게시판</Link>
      <Link to="/mypage">마이페이지</Link>
      <button className="nav-logout" onClick={onLogout} type="button">
        로그아웃
      </button>
    </header>
  );
}

function Sidebar({ active, user }) {
  const profile = user?.profile || {};
  const displayName = profile.nickname || user?.name || "사용자";
  const username = profile.username || "학생";
  const email = profile.email || user?.email || "";

  return (
    <aside className="posts-sidebar">
      <div className="side-profile">
        <div className="side-avatar">{displayName.slice(0, 1)}</div>

        <div>
          <strong>{displayName}</strong>
          <span>{username}</span>
          <p>HUFS MAP 회원</p>
          <p>{email}</p>
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

function formatDateTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default CommentPage;
