import "./Mainpage.css";

const quickMenus = [
  {
    title: "건물 검색",
    description: "건물명을 검색하여\n위치를 찾아보세요.",
    icon: "search",
    iconClass: "quickIconSearch",
  },
  {
    title: "게시판",
    description: "공지사항과 다양한 소식을\n확인해 보세요.",
    icon: "board",
    iconClass: "quickIconBoard",
  },
  {
    title: "편의시설",
    description: "식당, 카페, 화장실 등\n주요 시설을 확인하세요.",
    icon: "facility",
    iconClass: "quickIconFacility",
  },
];

function Mainpage({ onOpenBoard }) {
  return (
    <main className="mainPage">
      <div className="appFrame">
        <header className="topNav">
          <a href="#" className="navLink">
            캠퍼스맵
          </a>
          <a href="#" className="navLink">
            건물찾기
          </a>
          <button className="navLink navButtonLink" onClick={onOpenBoard} type="button">
            게시판
          </button>
          <a href="#" className="navLink">
            마이페이지
          </a>
          <a href="#" className="navLink">
            로그인/회원가입
          </a>
        </header>

        <section className="heroPanel">
          <div className="heroCopy">
            <p>한국외국어대학교 글로벌캠퍼스 맵로그</p>
            <h1>
              한눈에 보는
              <span>우리 학교</span>
            </h1>
            <strong>
              건물 위치와 편의시설을 쉽고 빠르게 확인하고
              <br />
              필요한 정보를 편리하게 이용해보세요.
            </strong>
            <button type="button">
              지도로 시작하기
              <ArrowIcon />
            </button>
          </div>

          <CampusIllustration />
        </section>

        <section className="quickMenuGrid">
          {quickMenus.map((menu) => (
            <button
              className="quickMenuCard"
              key={menu.title}
              onClick={menu.icon === "board" ? onOpenBoard : undefined}
              type="button"
            >
              <span className={`quickIcon ${menu.iconClass}`}>
                <QuickIcon type={menu.icon} />
              </span>
              <span className="quickText">
                <strong>{menu.title}</strong>
                <small>{menu.description}</small>
              </span>
              <span className="quickArrow">
                <ArrowIcon />
              </span>
            </button>
          ))}
        </section>

        <section className="mapPreview">
          <MapPattern />
          <button className="mapPreviewCard" type="button">
            <MapIcon />
            <span>
              <strong>캠퍼스 지도 미리보기</strong>
              <small>
                지도를 클릭하여
                <br />
                자세히 확인해 보세요.
              </small>
            </span>
          </button>
        </section>

        <footer className="footerLinks">
          <a href="#">이용약관</a>
          <span />
          <a href="#">개인정보처리방침</a>
          <span />
          <a href="#">문의하기</a>
        </footer>
      </div>
    </main>
  );
}

function CampusIllustration() {
  return (
    <div className="campusArt" aria-hidden="true">
      <svg viewBox="0 0 520 190" role="img">
        <g className="cloud">
          <ellipse cx="72" cy="34" rx="22" ry="12" />
          <ellipse cx="94" cy="29" rx="18" ry="16" />
          <ellipse cx="116" cy="36" rx="24" ry="10" />
        </g>
        <g className="cloud">
          <ellipse cx="328" cy="16" rx="21" ry="12" />
          <ellipse cx="350" cy="10" rx="18" ry="16" />
          <ellipse cx="375" cy="19" rx="27" ry="10" />
        </g>
        <g className="trees">
          <Tree x="36" y="120" />
          <Tree x="75" y="103" />
          <Tree x="105" y="125" />
          <Tree x="365" y="106" />
          <Tree x="486" y="111" />
        </g>
        <g className="mainBuilding">
          <path d="M184 73h102l20 27v72H164v-72z" />
          <path className="roof" d="M164 100l71-56 71 56z" />
          <path className="tower" d="M220 58l26-43 27 43v114h-53z" />
          <path className="towerRoof" d="M220 58h53l-27-43z" />
          <rect x="236" y="74" width="20" height="20" rx="10" />
          <path className="clockHand" d="M246 80v8h7" />
          <path className="door" d="M230 134a16 16 0 0 1 32 0v38h-32z" />
          <rect x="178" y="116" width="13" height="18" rx="2" />
          <rect x="201" y="116" width="13" height="18" rx="2" />
          <rect x="280" y="116" width="13" height="18" rx="2" />
          <rect x="246" y="105" width="13" height="18" rx="2" />
        </g>
        <g className="sideBuilding">
          <rect x="342" y="101" width="130" height="71" rx="3" />
          <rect x="332" y="90" width="150" height="13" rx="3" />
          <rect x="360" y="119" width="18" height="18" rx="2" />
          <rect x="392" y="119" width="18" height="18" rx="2" />
          <rect x="424" y="119" width="18" height="18" rx="2" />
          <rect x="360" y="147" width="18" height="18" rx="2" />
          <rect x="392" y="147" width="18" height="18" rx="2" />
          <rect x="424" y="147" width="18" height="18" rx="2" />
        </g>
        <path className="pin" d="M428 46c0-13 10-23 23-23s23 10 23 23c0 18-23 43-23 43s-23-25-23-43z" />
        <circle className="pinHole" cx="451" cy="46" r="8" />
        <path className="ground" d="M18 173h482" />
      </svg>
    </div>
  );
}

function Tree({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className="treeTrunk" x="10" y="32" width="7" height="37" rx="3" />
      <circle cx="13" cy="18" r="15" />
      <circle cx="3" cy="31" r="12" />
      <circle cx="24" cy="32" r="13" />
    </g>
  );
}

function MapPattern() {
  return (
    <svg className="mapPattern" viewBox="0 0 900 120" aria-hidden="true">
      <rect width="900" height="120" fill="#edf4ec" />
      <path d="M-20 95C105 64 133 95 237 63s153-63 272-30 179 78 411 22" />
      <path d="M7 19c118 55 215 73 334 38s246-39 373 41" />
      <path d="M172-20l90 164M396-18l-40 154M647-15l-84 158M785-16l103 158" />
      <path d="M-10 58h928" />
      <rect x="245" y="18" width="78" height="48" rx="4" />
      <rect x="392" y="66" width="90" height="38" rx="4" />
      <rect x="606" y="14" width="78" height="50" rx="4" />
      <rect x="734" y="66" width="92" height="36" rx="4" />
      <circle cx="120" cy="22" r="20" />
      <circle cx="524" cy="28" r="28" />
      <circle cx="690" cy="95" r="24" />
      <MapPin x="314" y="42" />
      <MapPin x="455" y="18" />
      <MapPin x="590" y="62" />
      <MapPin x="842" y="40" />
    </svg>
  );
}

function MapPin({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0c0-8 6-14 14-14s14 6 14 14c0 11-14 27-14 27S0 11 0 0z" />
      <circle cx="14" cy="0" r="5" />
    </g>
  );
}

function QuickIcon({ type }) {
  if (type === "search") {
    return (
      <svg viewBox="0 0 40 40">
        <circle cx="18" cy="18" r="10" />
        <path d="m26 26 8 8" />
      </svg>
    );
  }

  if (type === "board") {
    return (
      <svg viewBox="0 0 40 40">
        <rect x="11" y="7" width="18" height="26" rx="3" />
        <path d="M15 14h10M15 20h10M15 26h6" />
        <path d="M29 12h3v16h-3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40">
      <path d="M13 7v26M9 7v9a4 4 0 0 0 8 0V7" />
      <path d="M27 7c4 3 5 8 5 13 0 4-2 7-5 7v6" />
      <path d="M27 7v20" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg className="mapIcon" viewBox="0 0 42 42" aria-hidden="true">
      <path d="M7 11v24l9-5 10 5 9-5V6l-9 5-10-5z" />
      <path d="M16 6v24M26 11v24" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M6.5 3.75 11.75 9 6.5 14.25" />
    </svg>
  );
}

export default Mainpage;
