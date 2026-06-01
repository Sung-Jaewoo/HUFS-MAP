import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Mainpage from "./pages/Mainpage.jsx";
import Postpage from "./pages/Postpage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import MyPage from "./pages/Mypage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import MyPostsPage from "./pages/MyPostsPage.jsx";
import CommentPage from "./pages/CommentPage.jsx";
import FavoritePage from "./pages/FavoritePage.jsx";

const MAIN_PAGE_BY_PATH = {
  "/": "main",
  "/buildings": "buildings",
  "/facilities": "facilities",
  "/map": "map",
  "/campus-map": "campusMap",
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainExperience />} />
        <Route path="/buildings" element={<MainExperience />} />
        <Route path="/facilities" element={<MainExperience />} />
        <Route path="/map" element={<MainExperience />} />
        <Route path="/campus-map" element={<MainExperience />} />
        <Route path="/post" element={<PostExperience />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/edit" element={<EditProfilePage />} />
        <Route path="/mypage/posts" element={<MyPostsPage />} />
        <Route path="/mypage/comments" element={<CommentPage />} />
        <Route path="/mypage/favorites" element={<FavoritePage />} />
      </Routes>
    </BrowserRouter>
  );
}

function MainExperience() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = MAIN_PAGE_BY_PATH[location.pathname] || "main";

  return (
    <Mainpage
      page={page}
      selectedBuildingName={location.state?.buildingName || ""}
      onOpenBoard={() => navigate("/post")}
      onOpenBuildings={() => navigate("/buildings")}
      onOpenFacilities={() => navigate("/facilities")}
      onOpenHome={() => navigate("/")}
      onOpenLogin={() => navigate("/login")}
      onOpenMap={(buildingName) => navigate("/map", { state: { buildingName } })}
      onOpenMyPage={() => navigate("/mypage")}
      onOpenCampusMap={() => navigate("/campus-map")}
    />
  );
}

function PostExperience() {
  const navigate = useNavigate();

  const openMainFromPostSidebar = (event) => {
    const sideItem = event.target.closest(".sideTools .sideItem");

    if (!sideItem) return;

    const firstSideItem = sideItem.closest(".sideTools")?.querySelector(".sideItem");

    if (sideItem === firstSideItem) {
      event.preventDefault();
      event.stopPropagation();
      navigate("/");
    }
  };

  return (
    <div onClickCapture={openMainFromPostSidebar}>
      <Postpage />
    </div>
  );
}

export default App;
