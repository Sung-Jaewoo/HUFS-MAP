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

  return (
    <Mainpage
      page={page}
      selectedBuildingName={selectedBuildingName}
      onOpenBoard={() => navigateTo("post")}
      onOpenBuildings={() => navigateTo("buildings")}
      onOpenHome={() => navigateTo("main")}
      onOpenMap={(buildingName) => navigateTo("map", { buildingName })}
      onOpenCampusMap={() => navigateTo("campusMap")}
    />
  );
}

export default App;
