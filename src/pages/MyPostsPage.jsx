import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deletePostDocument, listMyPosts } from "../services/board";
import { getCurrentUser, logout } from "../services/auth";
import { toKoreanErrorMessage } from "../services/errors";
import "./MyPostsPage.css";

function MyPostsPage() {
  const navigate = useNavigate();
  const [boardFilter, setBoardFilter] = useState("전체");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        setPosts(await listMyPosts({ currentUserId: currentUser.$id }));
      } catch (loadError) {
        setError(toKoreanErrorMessage(loadError, "내가 쓴 글을 불러오지 못했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [navigate]);

  const boards = useMemo(
    () => ["전체", ...new Set(posts.map((post) => post.category || "게시판"))],
    [posts],
  );

  const filteredPosts = posts.filter((post) => {
    const board = post.category || "게시판";
    const matchesBoard = boardFilter === "전체" || board === boardFilter;
    const searchText = `${post.title} ${post.content}`.toLowerCase();
    const matchesKeyword = searchText.includes(keyword.trim().toLowerCase());

    return matchesBoard && matchesKeyword;
  });

  const handleLogout = async () => {
    await logout().catch(() => {});
    navigate("/login");
  };

  const removePost = async (postId) => {
    if (!window.confirm("이 게시글을 삭제하시겠습니까?")) return;

    try {
      await deletePostDocument({ postId });
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    } catch (deleteError) {
      window.alert(toKoreanErrorMessage(deleteError, "게시글을 삭제하지 못했습니다."));
    }
  };

  return (
    <div className="posts-page">
      <Header onLogout={handleLogout} />

      <div className="posts-layout">
        <Sidebar active="posts" user={user} />

        <main className="posts-main">
          <h1>내가 쓴 글</h1>
          <p>내가 작성한 게시글을 확인하고 관리할 수 있습니다.</p>

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
              placeholder="제목이나 내용을 검색하세요"
              value={keyword}
            />
          </section>

          <section className="table-card">
            {isLoading ? (
              <EmptyState text="내가 쓴 글을 불러오는 중입니다." />
            ) : error ? (
              <EmptyState text={error} />
            ) : filteredPosts.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>게시판</th>
                    <th>상태</th>
                    <th>작성일</th>
                    <th>좋아요</th>
                    <th>관리</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPosts.map((post, index) => (
                    <tr key={post.id}>
                      <td>{filteredPosts.length - index}</td>
                      <td>
                        <Link className="title-link" to="/post">
                          {post.title || "제목 없음"}
                        </Link>
                      </td>
                      <td>{post.category || "게시판"}</td>
                      <td>
                        <span className="status-badge">공개</span>
                      </td>
                      <td>{formatDate(post.createdAt)}</td>
                      <td>{post.likes}</td>
                      <td>
                        <button
                          className="table-action"
                          onClick={() => removePost(post.id)}
                          type="button"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState text="조건에 맞는 작성 글이 없습니다." />
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

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  });
}

export default MyPostsPage;
