import { useState } from "react";
import Mainpage from "./pages/Mainpage.jsx";
import Postpage from "./pages/Postpage.jsx";

function App() {
  const [page, setPage] = useState("main");

  const openMainFromPostSidebar = (event) => {
    const sideItem = event.target.closest(".sideTools .sideItem");

    if (!sideItem) return;

    const firstSideItem = sideItem.closest(".sideTools")?.querySelector(".sideItem");

    if (sideItem === firstSideItem) {
      event.preventDefault();
      event.stopPropagation();
      setPage("main");
    }
  };

  if (page === "post") {
    return (
      <div onClickCapture={openMainFromPostSidebar}>
        <Postpage />
      </div>
    );
  }

  return <Mainpage onOpenBoard={() => setPage("post")} />;
}

export default App;
