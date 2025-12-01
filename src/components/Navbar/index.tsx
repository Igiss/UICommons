// File: src/pages/Navbar/index.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Navbar/style.scss";
import LoginModal from "../../pages/Login";
import ProfileDropdownMenu from "./ProfileDropdownMenu"; // 👈 import menu

interface UserProfile {
  _id: string;
  email: string;
  userName: string;
  avatar: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // 👇 thêm state dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");

      if (token && !user) {
        try {
          const response = await fetch("http://localhost:3000/profile/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData: UserProfile = await response.json();
            setUser(userData);
          } else {
            console.error("Invalid token.");
            localStorage.removeItem("authToken");
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn, user]);

  const handleCreateClick = () => {
    if (isLoggedIn) {
      // Nếu đã đăng nhập, chuyển hướng đến trang tạo element
      navigate("/elements/new", { state: { openTypePopup: true } });
    } else {
      // Nếu chưa đăng nhập, hiển thị popup login
      setShowLoginPopup(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false); // tắt menu khi logout
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="ui">UI</span>Commons
      </Link>
      <ul className="menu">
        <li>
          <Link to="/elements">Yếu Tố</Link>
        </li>
        <li>
          <Link to="/spotlight">Nổi Bật</Link>
        </li>
        <li>
          <Link to="/challenges">Thử Thách</Link>
        </li>
      </ul>

      <div className="actions">
        <button className="create-btn" onClick={handleCreateClick}>
          + Create
        </button>

        {isLoggedIn && user ? (
          <div className="user-profile-container">
            {/* Avatar + Username */}
            <div
              className="user-profile-dropdown"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <span>{user.userName}</span>
              <img src={user.avatar} alt={user.userName} className="avatar" />
            </div>

            {/* Dropdown menu */}
            {showDropdown && <ProfileDropdownMenu onLogout={handleLogout} />}
          </div>
        ) : isLoggedIn ? (
          <div className="loading-spinner"></div>
        ) : null}
      </div>

      {!isLoggedIn && showLoginPopup && (
        <LoginModal
          onClose={() => setShowLoginPopup(false)}
          onLogin={() => {}}
        />
      )}
    </nav>
  );
};

export default Navbar;
