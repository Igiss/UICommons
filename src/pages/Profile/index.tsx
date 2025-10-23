import { useEffect, useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";

interface IUserPost {
  _id: string;
  title: string;
  thumbnail?: string;
  createdAt?: string;
  status?: "public" | "draft" | "review" | "rejected";
}

interface IUserProfile {
  email: string;
  // SỬA 1: Đồng bộ Interface với Database (viết hoa N)
  userName: string;
  avatar: string;
  favourites: number;
  posts: IUserPost[];
}

const ProfilePage = () => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Posts");
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/elements/new", { state: { openTypePopup: true } });
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:3000/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const usernameValue =
          data.userName || (data.email ? data.email.split("@")[0] : "user");

        // Tạo object mới
        const newUserObject = {
          email: data.email || "",

          userName: usernameValue,
          avatar:
            data.avatar || `https://ui-avatars.com/api/?name=${usernameValue}`,
          favourites: data.favourites?.length || 0,
          posts: data.posts || [],
        };

        setUser(newUserObject);
      })
      .catch((err) => console.error("Fetch profile failed", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="profile-loading">Đang tải hồ sơ...</div>;
  if (!user)
    return <div className="profile-error">Không tìm thấy người dùng</div>;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user.avatar} alt={user.userName} className="avatar" />
        </div>
        <div className="profile-info">
          <h1>{user.userName}</h1>
          <p className="email">{user.email}</p>
          <Link to="/settings" className="settings-btn">
            ⚙ Settings
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {["Posts", "Variations", "In Review", "Rejected", "Drafts"].map(
          (tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Content */}
      <div className="profile-content">
        {activeTab === "Posts" && (
          <>
            {user.posts.length > 0 ? (
              <div className="post-grid">
                {user.posts.map((post) => (
                  <div className="post-card" key={post._id}>
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="post-thumb"
                    />
                    <h3>{post.title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">▢</div>
                <h2>No Public Posts Yet</h2>
                <p>
                  Looks like you haven't made any posts yet. Click “Create” to
                  start sharing!
                </p>
                <button className="create-btn" onClick={handleCreateClick}>
                  ＋ Create
                </button>
              </div>
            )}
          </>
        )}

        {/* Các tab khác (để trống) */}
        {activeTab === "Variations" && <div className="tab-placeholder"></div>}
        {activeTab === "In Review" && <div className="tab-placeholder"></div>}
        {activeTab === "Rejected" && <div className="tab-placeholder"></div>}
        {activeTab === "Drafts" && <div className="tab-placeholder"></div>}
      </div>
    </div>
  );
};

export default ProfilePage;
