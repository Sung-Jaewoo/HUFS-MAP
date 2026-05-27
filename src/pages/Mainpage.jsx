import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Mainpage.css";

const campusCenter = [37.3379, 127.2688];
const markerIcon = L.divIcon({
  className: "leafletBuildingMarker",
  html: '<svg viewBox="0 0 32 44" aria-hidden="true"><path d="M16 43S3 27.8 3 16A13 13 0 0 1 29 16c0 11.8-13 27-13 27Z"/><circle cx="16" cy="16" r="5.5"/></svg>',
  iconSize: [32, 44],
  iconAnchor: [16, 43],
  popupAnchor: [0, -40],
});
const selectedMarkerIcon = L.divIcon({
  className: "leafletBuildingMarker selected",
  html: '<svg viewBox="0 0 40 54" aria-hidden="true"><path d="M20 53S4 34.7 4 20a16 16 0 0 1 32 0c0 14.7-16 33-16 33Z"/><circle cx="20" cy="20" r="7"/></svg>',
  iconSize: [40, 54],
  iconAnchor: [20, 53],
  popupAnchor: [0, -50],
});

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

const buildings = [
  {
    name: "공학관",
    tag: "공학 · 실험",
    description: "공학계열 강의실과\n실험실을 갖춘\n공학 교육의 중심 공간",
    image: "/buildings/gonghak.jpeg",
    position: [37.3375961, 127.2677859],
  },
  {
    name: "자연과학관",
    tag: "자연과학",
    description: "자연과학 계열 강의와\n연구 활동을 지원하는\n학습 중심 공간",
    image: "/buildings/jayeon.jpeg",
    position: [37.3389181, 127.2661526],
  },
  {
    name: "백년관",
    tag: "학생지원",
    description: "학생회 및 학생활동 지원 공간,\n다목적 홀을 갖춘\n학생 중심 공간",
    image: "/buildings/100nyeon.jpeg",
    position: [37.3373761, 127.2656101],
  },
  {
    name: "기숙사",
    tag: "생활관",
    description: "학생들의 안정적인 생활과\n편리한 캠퍼스 생활을\n지원하는 주거 공간",
    image: "/buildings/hufsdorm.jpeg",
    position: [37.33495, 127.26315],
  },
  {
    name: "교양관",
    tag: "교양",
    description: "다양한 교양 수업과\n학습 활동이 이루어지는\n기초 교육 공간",
    image: "/buildings/gyoyang.jpeg",
    position: [37.3397956, 127.2721503],
  },
  {
    name: "어문관",
    tag: "어문",
    description: "어문계열 강의와 연구를\n지원하는 글로벌캠퍼스의\n주요 교육 공간",
    image: "/buildings/a-moon.jpeg",
    position: [37.3382059, 127.2732724],
  },
  {
    name: "후생관",
    tag: "편의시설",
    description: "식당과 편의시설 등\n학생 생활에 필요한\n서비스를 제공하는 공간",
    image: "/buildings/husaeng.jpeg",
    position: [37.3377368, 127.2686096],
  },
  {
    name: "중앙도서관",
    tag: "도서관",
    description: "학술정보와 다양한 자료를\n제공하는 글로벌캠퍼스의\n중앙 도서관",
    image: "/buildings/hufslib.jpeg",
    position: [37.3366946, 127.2685176],
  },
  {
    name: "학생회관",
    tag: "학생지원",
    description: "학생 복지 및 다양한\n학생 지원 프로그램을\n제공하는 공간",
    image: "/buildings/hakgwan.jpeg",
    position: [37.3372949, 127.2698539],
  },
  {
    name: "인문경상관",
    tag: "인문 · 경상",
    description: "인문사회 및 경상계열\n강의와 학습을 지원하는\n교육 공간",
    image: "/buildings/kyungsangdae.jpeg",
    position: [37.3397409, 127.2745354],
  },
];

function Mainpage({
  page,
  selectedBuildingName,
  onOpenBoard,
  onOpenBuildings,
  onOpenHome,
  onOpenMap,
  onOpenCampusMap,
}) {
  const selectedBuilding =
    buildings.find((building) => building.name === selectedBuildingName) ||
    buildings[0];

  if (page === "map") {
    return (
      <MapPage
        building={selectedBuilding}
        onOpenBoard={onOpenBoard}
        onOpenBuildings={onOpenBuildings}
        onOpenCampusMap={onOpenCampusMap}
      />
    );
  }

  if (page === "campusMap") {
    return (
      <FullCampusMapPage
        onOpenBuildings={onOpenBuildings}
        onOpenHome={onOpenHome}
      />
    );
  }

  if (page === "buildings") {
    return (
      <main className="mainPage buildingListPage">
        <header className="topNav buildingTopNav">
          <button
            className="navLink navButtonLink"
            onClick={onOpenCampusMap}
            type="button"
          >
            캠퍼스맵
          </button>
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

        <section className="buildingPageContent">
          <div className="buildingHeader">
            <div>
              <p>건물 찾기</p>
              <h1>건물 목록</h1>
            </div>
            <button type="button" onClick={onOpenHome}>
              메인으로
            </button>
          </div>

          <div className="buildingGrid">
            {buildings.map((building) => (
              <article className="buildingCard" key={building.name}>
                <div className="buildingImage">
                  <img alt={`${building.name} 건물 사진`} src={building.image} />
                </div>
                <div className="buildingInfo">
                  <div className="buildingTitleRow">
                    <h2>{building.name}</h2>
                  </div>
                  <span>{building.tag}</span>
                  <p>{building.description}</p>
                  <button type="button" onClick={() => onOpenMap(building.name)}>
                    지도에서 보기
                    <ArrowIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mainPage">
      <div className="appFrame">
        <header className="topNav">
          <button
            className="navLink navButtonLink"
            onClick={onOpenCampusMap}
            type="button"
          >
            캠퍼스맵
          </button>
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
            <p>OO대학교 캠퍼스 맵</p>
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
              onClick={
                menu.icon === "board"
                  ? onOpenBoard
                  : menu.icon === "search"
                    ? onOpenBuildings
                    : undefined
              }
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
          <button className="mapPreviewCard" onClick={onOpenCampusMap} type="button">
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

function MapPage({
  building,
  onOpenBoard,
  onOpenBuildings,
  onOpenCampusMap,
}) {
  return (
    <main className="mainPage campusMapPage">
      <header className="topNav buildingTopNav">
        <button className="navLink navButtonLink" onClick={onOpenCampusMap} type="button">
          캠퍼스맵
        </button>
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

      <section className="campusMapContent">
        <div className="mapPageHeader">
          <div>
            <p>캠퍼스 지도</p>
            <h1>{building.name}</h1>
          </div>
          <button type="button" onClick={onOpenBuildings}>
            건물 목록
          </button>
        </div>

        <div className="campusMapShell">
          <div className="largeCampusMap">
            <MapContainer
              center={building.position || campusCenter}
              className="leafletCampusMap"
              scrollWheelZoom
              zoom={17}
            >
              <MapFocus position={building.position || campusCenter} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {buildings.map((mapBuilding) => (
                <Marker
                  icon={
                    mapBuilding.name === building.name
                      ? selectedMarkerIcon
                      : markerIcon
                  }
                  key={mapBuilding.name}
                  position={mapBuilding.position}
                >
                  <Popup>
                    <strong>{mapBuilding.name}</strong>
                    <br />
                    {mapBuilding.tag}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <aside className="mapBuildingPanel">
            <img alt={`${building.name} 건물 사진`} src={building.image} />
            <div>
              <strong>{building.name}</strong>
              <span>{building.tag}</span>
              <p>{building.description}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function FullCampusMapPage({ onOpenBuildings, onOpenHome }) {
  return (
    <main className="mainPage fullCampusMapPage">
      <div className="fullMapControls">
        <button type="button" onClick={onOpenHome}>
          메인으로
        </button>
        <button type="button" onClick={onOpenBuildings}>
          건물 목록
        </button>
      </div>

      <MapContainer
        center={campusCenter}
        className="fullLeafletMap"
        scrollWheelZoom
        zoom={16}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {buildings.map((building) => (
          <Marker icon={markerIcon} key={building.name} position={building.position}>
            <Popup>
              <strong>{building.name}</strong>
              <br />
              {building.tag}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  );
}

function MapFocus({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 17, { animate: true });
  }, [map, position]);

  return null;
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
