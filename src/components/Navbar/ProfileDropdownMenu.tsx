// File: src/components/Navbar/ProfileDropdownMenu.tsx

import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";

interface ProfileDropdownMenuProps {
  onLogout: () => void;
}

const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
  onLogout,
}) => {
  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole");

  return (
    <div className="profile-dropdown-menu">
      <ul>
        <li>
          <Link to="/profile">Your Profile</Link>
        </li>
        <li>
          <Link to="/favourite">Your Favorites</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>

        {/* Admin-only menu items */}
        {userRole === "admin" && (
          <>
            <li>
              <Link to="/admin">Review Components</Link>
            </li>
            <li>
              <Link to="/admin/challenges">Manage Challenges</Link>
            </li>
            <li>
              <Link to="/admin/users">Manage Users</Link>
            </li>
          </>
        )}

        {/* Reviewer/Moderator/Admin can access challenges */}
        {["reviewer", "moderator", "admin"].includes(userRole || "") && (
          <li>
            <Link to="/challenges">
              <span className="reviewer-badge">⭐</span> Rate Challenges
            </Link>
          </li>
        )}
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
