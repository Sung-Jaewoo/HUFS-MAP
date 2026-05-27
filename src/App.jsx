import { useEffect, useState } from "react";
import Mainpage from "./pages/Mainpage.jsx";
import Postpage from "./pages/Postpage.jsx";

function getPageFromHistoryState(state) {
  if (state?.appPage) return state.appPage;
  if (state?.view) return "post";
  return "main";
}

function App() {
  const [page, setPage] = useState("main");
  const [selectedBuildingName, setSelectedBuildingName] = useState("");

  useEffect(() => {
    const currentState = window.history.state;
    const currentPage = getPageFromHistoryState(currentState);

    setPage(currentPage);
    setSelectedBuildingName(currentState?.buildingName || "");

    if (!window.history.state?.appPage && !window.history.state?.view) {
      window.history.replaceState({ appPage: currentPage }, "");
    }

    const handlePopState = (event) => {
      setPage(getPageFromHistoryState(event.state));
      setSelectedBuildingName(event.state?.buildingName || "");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigateTo = (nextPage, extraState = {}) => {
    window.history.pushState({ appPage: nextPage, ...extraState }, "");
    setPage(nextPage);
    setSelectedBuildingName(extraState.buildingName || "");
  };

  const openMainFromPostSidebar = (event) => {
    const sideItem = event.target.closest(".sideTools .sideItem");

    if (!sideItem) return;

    const firstSideItem = sideItem.closest(".sideTools")?.querySelector(".sideItem");

    if (sideItem === firstSideItem) {
      event.preventDefault();
      event.stopPropagation();
      navigateTo("main");
    }
  };

  if (page === "post") {
    return (
      <div onClickCapture={openMainFromPostSidebar}>
        <Postpage />
      </div>
    );
  }

  if (page === "login") {
    return <PendingPage title="로그인/회원가입" onOpenHome={() => navigateTo("main")} />;
  }

  if (page === "mypage") {
    return <PendingPage title="마이페이지" onOpenHome={() => navigateTo("main")} />;
  }

  return (
    <Mainpage
      page={page}
      selectedBuildingName={selectedBuildingName}
      onOpenBoard={() => navigateTo("post")}
      onOpenBuildings={() => navigateTo("buildings")}
      onOpenFacilities={() => navigateTo("facilities")}
      onOpenHome={() => navigateTo("main")}
      onOpenLogin={() => navigateTo("login")}
      onOpenMap={(buildingName) => navigateTo("map", { buildingName })}
      onOpenMyPage={() => navigateTo("mypage")}
      onOpenCampusMap={() => navigateTo("campusMap")}
    />
  );
}

function PendingPage({ title, onOpenHome }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f7f8fc",
        color: "#151827",
        fontFamily:
          'Pretendard, "Noto Sans KR", Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 40, fontWeight: 900 }}>{title}</h1>
        <p style={{ margin: "16px 0 28px", color: "#697083", fontSize: 18 }}>
          해당 페이지는 다른 브랜치 머지 후 연결됩니다.
        </p>
        <button
          onClick={onOpenHome}
          style={{
            height: 44,
            padding: "0 20px",
            border: 0,
            borderRadius: 999,
            background: "#5b63ff",
            color: "#ffffff",
            font: "inherit",
            fontWeight: 800,
            cursor: "pointer",
          }}
          type="button"
        >
          메인으로
        </button>
      </section>
    </main>
  );
}

export default App;
