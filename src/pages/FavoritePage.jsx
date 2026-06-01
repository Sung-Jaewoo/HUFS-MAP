import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FavoritePage.css";

const currentUser = {
  name: "홍길동",
  role: "학생",
  department: "컴퓨터공학과",
  email: "honggildong@ooo.ac.kr",
};

const mockFavorites = [
  {
    id: 1,
    name: "학생회관",
    category: "학생지원",
    description: "학생 복지와 다양한 학생 지원 프로그램을 제공하는 공간",
    image: "https://images.unsplash.com/photo-1562774053-701939374585",
    buildingName: "학생회관",
  },
  {
    id: 2,
    name: "백년관",
    category: "학생지원",
    description: "학생회와 학생 활동을 지원하는 공간",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    buildingName: "백년관",
  },
  {
    id: 3,
    name: "공학관",
    category: "강의·실험",
    description: "공학계열 강의실과 실험실이 있는 공간",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    buildingName: "공학관",
  },
  {
    id: 4,
    name: "도서관",
    category: "도서관",
    description: "자료 열람과 학습을 위한 중앙 도서관",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2",
    buildingName: "도서관",
  },
];

function FavoritePage() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [favorites, setFavorites] = useState(mockFavorites);

  const categories = useMemo(
    () => ["전체", ...new Set(mockFavorites.map((favorite) => favorite.category))],
    [],
  );

  const filteredFavorites = favorites.filter((favorite) => {
    const matchesCategory = categoryFilter === "전체" || favorite.category === categoryFilter;
    const searchText = `${favorite.name} ${favorite.description}`.toLowerCase();
    const matchesKeyword = searchText.includes(keyword.trim().toLowerCase());

    return matchesCategory && matchesKeyword;
  });

  const removeFavorite = (favoriteId) => {
    if (window.confirm("즐겨찾기에서 삭제하시겠습니까?")) {
      setFavorites((current) => current.filter((favorite) => favorite.id !== favoriteId));
    }
  };

  const openMap = (buildingName) => {
    navigate("/map", { state: { buildingName } });
  };

  return (
    <div className="posts-page">
      <Header />

      <div className="posts-layout">
        <Sidebar active="favorites" />

        <main className="posts-main">
          <h1>즐겨찾기</h1>

          <p>즐겨찾기한 건물과 장소를 검색하고, 지도 이동과 해제 흐름을 확인할 수 있습니다.</p>

          <section className="search-box">
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
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
            {filteredFavorites.length > 0 ? (
              filteredFavorites.map((favorite) => (
                <article className="favorite-card" key={favorite.id}>
                  <button
                    aria-label={`${favorite.name} 즐겨찾기 해제`}
                    className="favorite-star-button"
                    onClick={() => removeFavorite(favorite.id)}
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
                        onClick={() => removeFavorite(favorite.id)}
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

function Header() {
  return (
    <header className="top-nav">
      <Link to="/">메인페이지</Link>
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

export default FavoritePage;
