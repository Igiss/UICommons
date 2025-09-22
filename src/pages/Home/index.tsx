import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import { elementsMock } from "../../mockData/home";
import LoginModal from "../../pages/Login/login"; // nhớ export default trong login.tsx

export interface IElement {
  id: number;
  title: string;
  css: string;
  reactCode: string;
  html?: string;
}

const Home = () => {
  const [search, setSearch] = useState("");
  const [elements, setElements] = useState<IElement[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const filtered = elements.filter((el) =>
    el.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleButtonClick = () => {
    if (isLoggedIn) {
      alert("Đã đăng nhập");
    } else {
      setShowLoginPopup(true); // ✅ dùng hàm setter
    }
  };

  const handleLogin = () => {
    // ví dụ login thành công
    setIsLoggedIn(true);
    setShowLoginPopup(false); // ✅ tắt popup
  };

  useEffect(() => {
    setElements(elementsMock);
    console.log("Render.........");
  }, []);

  return (
    <div className="home">
      <div className="header">
        <h1>UICommons</h1>
        {/* Nút Create */}
        <button className="create-btn" onClick={handleButtonClick}>
          + Create
        </button>
      </div>

      {/* Popup login */}
      {showLoginPopup && (
        <LoginModal
          onClose={() => setShowLoginPopup(false)}
          onLogin={handleLogin}
        />
      )}

      <input
        type="text"
        placeholder="Tìm component..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      <div className="grid">
        {filtered.map((el) => (
          <Link to={`/element/${el.id}`} key={el.id} className="card">
            <iframe
              title={el.title}
              className="preview"
              srcDoc={`
          <html>
            <head>
              <style>
                body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                }
                ${el.css}
              </style>
            </head>
            <body>
              ${el.html}
            </body>
          </html>
        `}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
