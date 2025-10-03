// File: src/pages/Navbar/ProfileDropdownMenu.tsx

import React from "react";
import { Link } from "react-router-dom";
import "./style.scss"; // Chúng ta sẽ dùng chung file style với Navbar

interface ProfileDropdownMenuProps {
  onLogout: () => void;
}

const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
  onLogout,
}) => {
  return (
    <div className="profile-dropdown-menu">
      <ul>
        <li>
          <Link to="/profile">Your Profile</Link>
        </li>
        <li>
          <Link to="/favorites">Your Favorites</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
      <div className="divider"></div>
      <ul>
        <li>
          <a href="#">Give feedback</a>
        </li>
        <li>
          <a href="#">Report bug</a>
        </li>
      </ul>
      <div className="divider"></div>
      <ul>
        <li>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="discord-link"
          >
            Join Discord
          </a>
        </li>
      </ul>
      <div className="divider"></div>
      <ul>
        <li>
          <button onClick={onLogout} className="logout-menu-btn">
            Log out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdownMenu;
