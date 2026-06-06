import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  listFavoriteBuildingCards,
  toggleFavoriteBuilding,
} from "../services/board";
import { getCurrentUser, logout } from "../services/auth";
import { toKoreanErrorMessage } from "../services/errors";
import "./FavoritePage.css";

function FavoritePage() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        setFavorites(await listFavoriteBuildingCards({ userId: currentUser.$id }));
      } catch (loadError) {
        setError(toKoreanErrorMessage(loadError, "즐겨찾기를 불러오지 못했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [navigate]);

  const categories = useMemo(
    () => ["전체", ...new Set(favorites.map((favorite) => favorite.category))],
    [favorites],
  );

  const filteredFavorites = favorites.filter((favorite) => {
    const matchesCategory =
      categoryFilter === "전체" || favorite.category === categoryFilter;
    const searchText = `${favorite.name} ${favorite.description}`.toLowerCase();
    const matchesKeyword = searchText.includes(keyword.trim().toLowerCase());

    return matchesCategory && matchesKeyword;
  });

  const handleLogout = async () => {
    await logout().catch(() => {});
    navigate("/login");
  };

  const removeFavorite = async (favorite) => {
    if (!window.confirm("즐겨찾기에서 삭제하시겠습니까?")) return;

    try {
      await toggleFavoriteBuilding({
        building: favorite.name,
        userId: user.$id,
      });
      setFavorites((currentFavorites) =>
        currentFavorites.filter((item) => item.id !== favorite.id),
      );
    } catch (deleteError) {
      window.alert(toKoreanErrorMessage(deleteError, "즐겨찾기를 삭제하지 못했습니다."));
    }
  };

  const openMap = (buildingName) => {
    navigate("/map", { state: { buildingName } });
  };

  return (
    <div className="posts-page">
      <Header onLogout={handleLogout} />

      <div className="posts-layout">
        <Sidebar active="favorites" user={user} />

        <main className="posts-main">
          <h1>즐겨찾기</h1>
          <p>즐겨찾기한 건물을 검색하고 지도에서 확인할 수 있습니다.</p>

          <section className="search-box">
            <select
              onChange={(event) => setCategoryFilter(event.target.value)}
              value={categoryFilter}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <input
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="건물명이나 설명을 검색하세요"
              value={keyword}
            />
          </section>

          <section className="favorite-grid">
            {isLoading ? (
              <EmptyState text="즐겨찾기를 불러오는 중입니다." />
            ) : error ? (
              <EmptyState text={error} />
            ) : filteredFavorites.length > 0 ? (
              filteredFavorites.map((favorite) => (
                <article className="favorite-card" key={favorite.id}>
                  <button
                    aria-label={`${favorite.name} 즐겨찾기 해제`}
                    className="favorite-star-button"
                    onClick={() => removeFavorite(favorite)}
                    title="즐겨찾기 해제"
                    type="button"
                  >
                    ★
                  </button>
                  <img alt={`${favorite.name} 이미지`} src={favorite.image} />

                  <div className="favorite-info">
                    <h3>{favorite.name}</h3>
                    <span>{favorite.category}</span>
                    <p>{favorite.description}</p>

                    <div className="favorite-actions">
                      <button onClick={() => openMap(favorite.buildingName)} type="button">
                        지도에서 보기
                      </button>
                      <button
                        className="danger-action"
                        onClick={() => removeFavorite(favorite)}
                        type="button"
                      >
                        해제
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState text="조건에 맞는 즐겨찾기가 없습니다." />
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

export default FavoritePage;
