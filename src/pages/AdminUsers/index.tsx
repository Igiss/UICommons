import { useEffect, useState } from "react";
import "./style.scss";

interface IUser {
  _id: string;
  userName: string;
  email: string;
  avatar: string;
  role: "user" | "reviewer" | "moderator" | "admin";
  promotedBy?: string;
  promotedAt?: string;
  createdAt?: string;
}

const AdminUsers = () => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [eligibleUsers, setEligibleUsers] = useState<IUser[]>([]);
  const [reviewers, setReviewers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "eligible" | "reviewers">("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
    
    try {
      setLoading(true);
      
      // Fetch all users
      const allRes = await fetch("http://localhost:3000/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allData = await allRes.json();
      setAllUsers(allData);

      // Fetch eligible users (users only)
      const eligibleRes = await fetch("http://localhost:3000/accounts/eligible-for-promotion", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eligibleData = await eligibleRes.json();
      setEligibleUsers(eligibleData);

      // Fetch reviewers/moderators
      const reviewersRes = await fetch("http://localhost:3000/accounts/reviewers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reviewersData = await reviewersRes.json();
      setReviewers(reviewersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId: string, role: "reviewer" | "moderator") => {
    if (!confirm(`Promote this user to ${role}?`)) return;

    const token = localStorage.getItem("authToken");
    
    try {
      const res = await fetch(`http://localhost:3000/accounts/${userId}/promote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        alert(`User promoted to ${role} successfully!`);
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to promote user");
      }
    } catch (error) {
      console.error("Error promoting user:", error);
      alert("Failed to promote user");
    }
  };

  const handleDemoteUser = async (userId: string) => {
    if (!confirm("Demote this user back to regular user?")) return;

    const token = localStorage.getItem("authToken");
    
    try {
      const res = await fetch(`http://localhost:3000/accounts/${userId}/demote`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("User demoted successfully!");
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to demote user");
      }
    } catch (error) {
      console.error("Error demoting user:", error);
      alert("Failed to demote user");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "#ef4444";
      case "moderator": return "#f59e0b";
      case "reviewer": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return "👑";
      case "moderator": return "🛡️";
      case "reviewer": return "⭐";
      default: return "👤";
    }
  };

  const getDisplayUsers = () => {
    let users: IUser[] = [];
    
    switch (selectedTab) {
      case "all":
        users = allUsers;
        break;
      case "eligible":
        users = eligibleUsers;
        break;
      case "reviewers":
        users = reviewers;
        break;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      users = users.filter(
        (user) =>
          user.userName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    return users;
  };

  const displayUsers = getDisplayUsers();

  if (loading) {
    return (
      <div className="admin-users-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <h1>👥 User Management</h1>
        <div className="admin-users__stats">
          <div className="stat-card">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{allUsers.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Reviewers/Moderators</span>
            <span className="stat-value">{reviewers.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Eligible</span>
            <span className="stat-value">{eligibleUsers.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-users__tabs">
        <button
          className={`tab ${selectedTab === "all" ? "tab--active" : ""}`}
          onClick={() => setSelectedTab("all")}
        >
          All Users ({allUsers.length})
        </button>
        <button
          className={`tab ${selectedTab === "eligible" ? "tab--active" : ""}`}
          onClick={() => setSelectedTab("eligible")}
        >
          Eligible for Promotion ({eligibleUsers.length})
        </button>
        <button
          className={`tab ${selectedTab === "reviewers" ? "tab--active" : ""}`}
          onClick={() => setSelectedTab("reviewers")}
        >
          Reviewers & Moderators ({reviewers.length})
        </button>
      </div>

      {/* Search */}
      <div className="admin-users__search">
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="admin-users__list">
        {displayUsers.length === 0 ? (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        ) : (
          displayUsers.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-card__info">
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="user-card__avatar"
                />
                <div className="user-card__details">
                  <div className="user-card__name-row">
                    <span className="user-card__name">{user.userName}</span>
                    <span
                      className="user-card__role"
                      style={{ backgroundColor: getRoleColor(user.role) }}
                    >
                      {getRoleIcon(user.role)} {user.role}
                    </span>
                  </div>
                  <span className="user-card__email">{user.email}</span>
                  {user.promotedAt && (
                    <span className="user-card__promoted">
                      Promoted: {new Date(user.promotedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="user-card__actions">
                {user.role === "user" && (
                  <>
                    <button
                      className="btn btn--reviewer"
                      onClick={() => handlePromoteUser(user._id, "reviewer")}
                    >
                      ⭐ Make Reviewer
                    </button>
                    <button
                      className="btn btn--moderator"
                      onClick={() => handlePromoteUser(user._id, "moderator")}
                    >
                      🛡️ Make Moderator
                    </button>
                  </>
                )}

                {(user.role === "reviewer" || user.role === "moderator") && (
                  <>
                    {user.role === "reviewer" && (
                      <button
                        className="btn btn--moderator"
                        onClick={() => handlePromoteUser(user._id, "moderator")}
                      >
                        🛡️ Promote to Moderator
                      </button>
                    )}
                    <button
                      className="btn btn--demote"
                      onClick={() => handleDemoteUser(user._id)}
                    >
                      ⬇️ Demote to User
                    </button>
                  </>
                )}

                {user.role === "admin" && (
                  <span className="admin-badge">Cannot modify admin</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
