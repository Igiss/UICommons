import { useEffect, useState } from "react";
import "./style.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import ElementPreview from "../ElementPreview";

interface IUserPost {
  _id: string;
  title: string;
  thumbnail?: string;
  htmlCode: string;
  cssCode: string;
  createdAt?: string;
  status: "draft" | "public" | "rejected" | "review"; 
  parentId?: string;
}

interface IUserProfile {
  email: string;
  userName: string; 
  avatar: string;
  favourites: number;
  posts: IUserPost[];
}

const API_URL = "http://localhost:3000";

const ProfilePage = () => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<{ [key: string]: IUserPost[] }>({});
  const [loadingTabs, setLoadingTabs] = useState<{ [key: string]: boolean }>({});

  const handleCreateClick = () => {
    navigate("/elements/new", { state: { openTypePopup: true } });
  };
  
  // Handle token from URL
  useEffect(() => {
    const queryToken = new URLSearchParams(location.search).get('token');
    if (queryToken) {
      localStorage.setItem('authToken', queryToken);
      window.history.replaceState({}, '', '/profile');
    }
  }, [location]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        const usernameValue = data.userName || data.username || (data.email ? data.email.split("@")[0] : "user");

        const newUserObject: IUserProfile = {
          email: data.email || "",
          userName: usernameValue,
          avatar: data.avatar || `https://ui-avatars.com/api/?name=${usernameValue}`,
          favourites: data.favourites?.length || 0,
          posts: data.posts || [],
        };

        setUser(newUserObject);
      } catch (err: any) {
        console.error("Fetch profile failed", err);
        setError(err.response?.status === 401 ? "Session expired. Please log in again." : "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch posts for all tabs
  useEffect(() => {
    if (user) {
      // Map display tab names to backend tab values (matching component.service.ts)
      const tabMap: { [key: string]: string } = {
        "Posts": "post",           // Maps to status='public' with no parentId
        "Variations": "variations", // Maps to status='public' with parentId
        "In Review": "review",      // Maps to status='review'
        "Rejected": "rejected",     // Maps to status='rejected'
        "Drafts": "draft",          // Maps to status='draft'
      };

      Object.keys(tabMap).forEach((displayTab) => {
        const backendTab = tabMap[displayTab];
        setLoadingTabs(prev => ({ ...prev, [displayTab]: true }));
        fetchTabPosts(backendTab, displayTab);
      });
    }
  }, [user]);

  const fetchTabPosts = async (backendTab: string, displayTab: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoadingTabs(prev => ({ ...prev, [displayTab]: false }));
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/components/user/${backendTab}`, { 
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`✅ Fetched ${displayTab} (${backendTab}):`, res.data);
      setPosts((prev) => ({ ...prev, [displayTab]: res.data || [] }));
    } catch (err: any) {
      console.error(`❌ Error fetching ${backendTab}:`, err.response?.data || err.message);
      setPosts((prev) => ({ ...prev, [displayTab]: [] }));
    } finally {
      setLoadingTabs(prev => ({ ...prev, [displayTab]: false }));
    }
  };
  
  const getPostsForTab = (tab: string): IUserPost[] => {
    return posts[tab] || [];
  };

  const renderTabContent = (
    tab: string, 
    emptyMessage: string, 
    showCreate: boolean = false, 
    emptyIcon: string = "▢"
  ) => {
    const isLoading = loadingTabs[tab];
    const tabPosts = getPostsForTab(tab);

    if (isLoading) {
      return <div className="tab-loading">Loading {tab.toLowerCase()}...</div>;
    }

    if (tabPosts.length > 0) {
      return (
        <div className="grid">
          {tabPosts.map((post) => (
            <Link to={`/element/${post._id}`} key={post._id} className="card">
              <ElementPreview htmlCode={post.htmlCode} cssCode={post.cssCode} />
              <div className="card-info">
                <h3>{post.title}</h3>
                {post.createdAt && (
                  <p className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      );
    } else {
      return (
        <div className="empty-state">
          <div className="empty-icon">{emptyIcon}</div>
          <h2>{emptyMessage}</h2>
          {showCreate && (
            <>
              <p>Click "Create" to start sharing!</p>
              <button className="create-btn" onClick={handleCreateClick}>
                ＋ Create
              </button>
            </>
          )}
        </div>
      );
    }
  };

  // Loading state
  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  // Error state
  if (error || !user) {
    return (
      <div className="profile-error">
        {error || "User not found"}
        <p>Please log in:</p>
        <a href={`${API_URL}/auth/google`}>Login with Google</a><br />
        <a href={`${API_URL}/auth/github`}>Login with GitHub</a><br />
        <a href={`${API_URL}/auth/discord`}>Login with Discord</a>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user.avatar} alt={user.userName} className="avatar" />
        </div>
        <div className="profile-info">
          <h1>{user.userName}</h1>
          <p className="username">@{user.userName}</p>
          <p className="email">{user.email}</p>
          <p>Favourites: {user.favourites}</p>
          <Link to="/settings" className="settings-btn">
            ⚙ Settings
          </Link>
        </div>
      </div>

      <div className="profile-content">
        <Tabs>
          <TabList>
            <Tab>Posts</Tab>
            <Tab>Variations</Tab>
            <Tab>In Review</Tab>
            <Tab>Rejected</Tab>
            <Tab>Drafts</Tab>
          </TabList>

          <TabPanel>
            {renderTabContent("Posts", "No public posts yet", true, "▢")}
          </TabPanel>
          <TabPanel>
            {renderTabContent("Variations", "No variations yet", true, "♻")}
          </TabPanel>
          <TabPanel>
            {renderTabContent("In Review", "No submissions in review", false, "⏳")}
          </TabPanel>
          <TabPanel>
            {renderTabContent("Rejected", "No rejected submissions", false, "✗")}
          </TabPanel>
          <TabPanel>
            {renderTabContent("Drafts", "No drafts yet", true, "📝")}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
