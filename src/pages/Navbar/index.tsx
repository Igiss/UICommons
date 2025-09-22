import { useState } from "react";
import { Link } from "react-router-dom";
import "../Navbar/style.scss";
import LoginModal from "../Login"; // nhớ export default

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      alert("Đã đăng nhập");
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginPopup(false);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        <span className="ui">UI</span>Commons
      </Link>

      {/* Menu */}
      <ul className="menu">
        <li>
          <Link to="/elements">Elements</Link>
        </li>
        <li>
          <Link to="/challenges">Challenges</Link>
        </li>
        <li>
          <Link to="/spotlight">Spotlight</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
      </ul>

      {/* Action bên phải */}
      <div className="actions">
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
    </nav>
  );
};

export default Navbar;
