import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.scss";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import ExportPopup from "./popupExport";
import { EditorView, lineNumbers } from "@codemirror/view";
import axios from "axios";

const API_URL = "http://localhost:3000";

interface IAccount {
  _id: string;
  userName: string;
  avatar: string;
}

interface IComment {
  _id: string;
  content: string;
  createdAt: string;
  accountId: string | IAccount;
  componentId: string;
  parentId?: string | null;
  account?: IAccount;
  replies?: IComment[];
}

interface IElement {
  _id: string;
  title: string;
  htmlCode: string;
  cssCode: string;
  reactCode?: string;
  litCode?: string;
  svelteCode?: string;
  vueCode?: string;
  createdAt: string;
  accountId: string | IAccount;
  account?: IAccount;
}

const ElementDetail = () => {
  const { id } = useParams();
  const [element, setElement] = useState<IElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [exportCode, setExportCode] = useState("");
  const [selectedExport, setSelectedExport] = useState("react");

  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [favouritesCount, setFavouritesCount] = useState<number>(0);
  const [viewsCount, setViewsCount] = useState<number>(0);

  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [currentUser, setCurrentUser] = useState<IAccount | null>(null);

  const token = localStorage.getItem("authToken");

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser({
          _id: res.data._id,
          userName: res.data.userName,
          avatar: res.data.avatar,
        });
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    fetchCurrentUser();
  }, [token]);

  // Fetch element data
  useEffect(() => {
    if (!id) return;
    const fetchElementData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/components/${id}/with-stats`);

        console.log("Full response from with-stats:", res.data);

        const elementData: IElement = {
          ...res.data,
          htmlCode: res.data.htmlCode || "",
          cssCode: res.data.cssCode || "",
          account:
            res.data.accountId && typeof res.data.accountId === "object"
              ? {
                  _id: res.data.accountId._id,
                  userName: res.data.accountId.userName,
                  avatar: res.data.accountId.avatar,
                }
              : undefined,
        };

        setElement(elementData);

        setViewsCount(res.data.viewsCount || 0);
        setFavouritesCount(res.data.favouritesCount || 0);

        console.log("Views count from with-stats:", res.data.viewsCount);
        console.log(
          "Favourites count from with-stats:",
          res.data.favouritesCount
        );

        // Record view
        try {
          await axios.post(
            `${API_URL}/views/${id}`,
            {},
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          console.log("View recorded");
        } catch {
          console.log("View tracking not available");
        }

        // Check favourite status
        if (token) {
          try {
            const favRes = await axios.get(
              `${API_URL}/favourites/check/${id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setIsFavourite(favRes.data.isFavourite);
          } catch (err) {
            console.error("Error checking favourite:", err);
          }
        }
      } catch (err) {
        console.error("Error loading component:", err);
        setError("Unable to load component data.");
      } finally {
        setLoading(false);
      }
    };
    fetchElementData();
  }, [id, token]);

  // Fetch comments
  useEffect(() => {
    if (!id) return;
    const fetchComments = async () => {
      try {
        const res = await axios.get<IComment[]>( // 👈 Gợi ý: Thêm type cho response
          `${API_URL}/comments?componentId=${id}`
        );
        const commentsData = res.data;

        const mappedComments = commentsData.map((comment: IComment) => ({
          // 👈 ĐÃ SỬA: 'any' thành 'IComment'
          ...comment,
          account:
            comment.accountId && typeof comment.accountId === "object"
              ? {
                  _id: comment.accountId._id,
                  userName: comment.accountId.userName,
                  avatar: comment.accountId.avatar,
                }
              : undefined,
        }));

        // xep comment thanh tree structure
        const organized = organizeComments(mappedComments);
        setComments(organized);
        console.log("Comments loaded:", organized.length);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [id]);

  const organizeComments = (commentsData: IComment[]): IComment[] => {
    const commentMap = new Map<string, IComment>();
    const rootComments: IComment[] = [];

    commentsData.forEach((comment) => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    commentsData.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment._id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies!.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const handleToggleFavourite = async () => {
    if (!id || !token) {
      alert("Đăng nhập để lưu");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/favourites/toggle`,
        { componentId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newIsFavourite = res.data.isFavourite;
      setIsFavourite(newIsFavourite);

      try {
        const countRes = await axios.get(`${API_URL}/favourites/count/${id}`);
        setFavouritesCount(countRes.data.count || 0);
        console.log("Favourites count updated:", countRes.data.count);
      } catch {
        console.log("Failed to fetch updated count");
      }

      console.log("Favourite toggled:", newIsFavourite);
    } catch (err) {
      console.error("Error toggling favourite:", err);

      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to toggle favourite");
      } else {
        alert("An unknown error occurred while toggling favourite.");
      }
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      alert("Làm ơn hãy viết 1 bình luận");
      return;
    }

    if (!token || !id) {
      alert("Làm ơn hãy đăng nhập để bình luận");
      return;
    }

    try {
      console.log("Posting comment:", { content: newComment, componentId: id });

      const res = await axios.post(
        `${API_URL}/comments`,
        {
          content: newComment,
          componentId: id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Comment posted:", res.data);

      const newCommentData: IComment = {
        ...res.data,
        account:
          res.data.accountId && typeof res.data.accountId === "object"
            ? {
                _id: res.data.accountId._id,
                userName: res.data.accountId.userName,
                avatar: res.data.accountId.avatar,
              }
            : currentUser || undefined,
        replies: [],
      };

      setComments((prev) => [newCommentData, ...prev]);
      setNewComment("");
    } catch (err) {
      // 👈 ĐÃ SỬA: Bỏ ': any'
      if (axios.isAxiosError(err)) {
        console.error(
          "Error posting comment:",
          err.response?.data || err.message
        );
        alert(err.response?.data?.message || "Failed to post comment");
      } else {
        console.error("Error posting comment:", err);
        alert("An unknown error occurred.");
      }
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (!replyContent.trim()) {
      alert("Làm ơn hay nhập 1 bình luận");
      return;
    }

    if (!token || !id) {
      alert("Làm ơn hãy đăng nhập để bình luận");
      return;
    }

    try {
      console.log("Posting reply:", {
        content: replyContent,
        componentId: id,
        parentId,
      });

      const res = await axios.post(
        `${API_URL}/comments`,
        {
          content: replyContent,
          componentId: id,
          parentId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Reply posted:", res.data);

      // Refresh comments
      const commentsRes = await axios.get<IComment[]>( // 👈 Gợi ý: Thêm type cho response
        `${API_URL}/comments?componentId=${id}`
      );
      const mappedComments = commentsRes.data.map((comment: IComment) => ({
        // 👈 ĐÃ SỬA: 'any' thành 'IComment'
        ...comment,
        account:
          comment.accountId && typeof comment.accountId === "object"
            ? {
                _id: comment.accountId._id,
                userName: comment.accountId.userName,
                avatar: comment.accountId.avatar,
              }
            : undefined,
      }));
      setComments(organizeComments(mappedComments));
      setReplyContent("");
      setReplyingTo(null);
    } catch (err) {
      // 👈 ĐÃ SỬA: Bỏ ': any'
      if (axios.isAxiosError(err)) {
        console.error(
          "Error posting reply:",
          err.response?.data || err.message
        );
        alert(err.response?.data?.message || "Failed to post reply");
      } else {
        console.error("Error posting reply:", err);
        alert("An unknown error occurred.");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const renderComment = (comment: IComment, isReply = false) => (
    <div
      key={comment._id}
      className={`comment ${isReply ? "comment--reply" : ""}`}
    >
      <img
        src={
          comment.account?.avatar ||
          `https://ui-avatars.com/api/?name=${
            comment.account?.userName || "User"
          }`
        }
        alt="avatar"
        className="comment__avatar"
      />
      <div className="comment__content">
        <div className="comment__header">
          <span className="comment__author">
            {comment.account?.userName || "Anonymous"}
          </span>
          <span className="comment__date">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="comment__text">{comment.content}</p>
        {!isReply && token && (
          <button
            className="comment__reply-btn"
            onClick={() => setReplyingTo(comment._id)}
          >
            Reply
          </button>
        )}

        {replyingTo === comment._id && (
          <div className="comment__reply-form">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Viết lời đáp..."
              className="comment__textarea"
            />
            <div className="comment__reply-actions">
              <button
                onClick={() => handlePostReply(comment._id)}
                className="btn-primary"
              >
                Post Reply
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="comment__replies">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="detail-status">Loading component...</div>;
  if (error) return <div className="detail-status error">{error}</div>;
  if (!element)
    return <div className="detail-status">Component not found.</div>;

  return (
    <div className="detail">
      {/* poster info */}
      <header className="detail-header">
        <Link to="/elements" className="back-btn">
          ← Go back
        </Link>

        <div className="stats">
          <div className="info">
            <span className="title">
              {element.title} <span className="by">by</span>
            </span>
            <div className="author">
              <img
                src={
                  element.account?.avatar ||
                  `https://ui-avatars.com/api/?name=${
                    element.account?.userName || "User"
                  }`
                }
                alt="author"
                className="avatar"
              />
              <span>{element.account?.userName || "Anonymous"}</span>
            </div>
          </div>
          <div className="stat">
            👁️ <span>{viewsCount} views</span>
          </div>
          <div className="stat" onClick={handleToggleFavourite}>
            <span
              style={{
                color: isFavourite ? "#FFD700" : "#aaa",
                cursor: "pointer",
              }}
            >
              {isFavourite ? "★" : "☆"}
            </span>{" "}
            <span>{favouritesCount}</span>
          </div>
        </div>
      </header>

      <div className="detail__row">
        {/* Preview */}
        <div className="detail__preview">
          <iframe
            title={element.title}
            className="preview-iframe"
            srcDoc={`<style>body {display:flex;justify-content:center;align-items:center;height:100vh;margin:0;overflow:hidden;}${element.cssCode}</style>${element.htmlCode}`}
          />
        </div>

        {/* Code viewer */}
        <div className="detail__code-viewer">
          <div className="tabs">
            <div className="tabs__header">
              <button
                className={`tabs__button ${
                  activeTab === "html" ? "tabs__button--active" : ""
                }`}
                onClick={() => setActiveTab("html")}
              >
                HTML
              </button>
              <button
                className={`tabs__button ${
                  activeTab === "css" ? "tabs__button--active" : ""
                }`}
                onClick={() => setActiveTab("css")}
              >
                CSS
              </button>
            </div>

            <div className="tabs__content">
              {activeTab === "html" && (
                <CodeMirror
                  value={element.htmlCode}
                  theme={vscodeDark}
                  height="600px"
                  extensions={[html(), lineNumbers(), EditorView.lineWrapping]}
                  editable={false}
                  basicSetup={false}
                />
              )}
              {activeTab === "css" && (
                <CodeMirror
                  value={element.cssCode}
                  height="600px"
                  theme={vscodeDark}
                  extensions={[css(), lineNumbers(), EditorView.lineWrapping]}
                  editable={false}
                  basicSetup={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="detail__actions">
        <button className="action-btn" onClick={handleToggleFavourite}>
          <span style={{ color: isFavourite ? "#FFD700" : "#888" }}>
            {isFavourite ? "★" : "☆"}
          </span>
          {isFavourite ? "Save to favourites" : "Save to favourites"}
        </button>

        <div className="export-group">
          <button
            className="action-btn"
            onClick={() => {
              let code = "";
              switch (selectedExport) {
                case "react":
                  code = element.reactCode || "No React code available.";
                  break;
                case "vue":
                  code = element.vueCode || "No Vue code available.";
                  break;
                case "svelte":
                  code = element.svelteCode || "No Svelte code available.";
                  break;
                case "lit":
                  code = element.litCode || "No Lit code available.";
                  break;
                default:
                  code = "Please select export type.";
              }
              setExportCode(code);
              setShowExportPopup(true);
            }}
          >
            ⚙️ Export
          </button>

          <select
            className="export-select"
            value={selectedExport}
            onChange={(e) => setSelectedExport(e.target.value)}
          >
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="svelte">Svelte</option>
            <option value="lit">Lit</option>
          </select>
        </div>

        <ExportPopup
          visible={showExportPopup}
          language={selectedExport}
          code={exportCode}
          onClose={() => setShowExportPopup(false)}
        />
      </div>

      {/* Comments Section */}
      {/* Comments + Sidebar */}
      <div className="detail__bottom">
        {/* LEFT: Comments */}
        <div className="detail__comments">
          <h2>Comments ({comments.length})</h2>

          {token ? (
            <div className="comment-form">
              <img
                src={
                  currentUser?.avatar || "https://ui-avatars.com/api/?name=User"
                }
                alt="your avatar"
                className="comment-form__avatar"
              />
              <div className="comment-form__input-area">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="comment-form__textarea"
                />
                <button
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  className="comment-form__submit"
                >
                  Đăng bình luận
                </button>
              </div>
            </div>
          ) : (
            <div className="comment-login-prompt">
              <p>Đăng nhập để bình luận</p>
            </div>
          )}

          <div className="comments-list">
            {comments.map((comment) => renderComment(comment))}
            {comments.length === 0 && (
              <p className="no-comments">
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <aside className="detail__sidebar">
          <h3 className="sidebar-title">{element.title}</h3>

          <div className="sidebar-meta">
            <div className="sidebar-date">
              📅{" "}
              {new Date(element.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <button className="sidebar-report">⚠️ Report</button>
          </div>

          <div className="sidebar-author">
            <img
              src={
                element.account?.avatar ||
                `https://ui-avatars.com/api/?name=${
                  element.account?.userName || "User"
                }`
              }
              alt="author"
              className="sidebar-avatar"
            />
            <div className="sidebar-author-info">
              <strong>{element.account?.userName || "Anonymous"}</strong>
              <span>{element.account ? element.account.userName : "User"}</span>
            </div>
          </div>

          {/* Variation box */}
          <div className="sidebar-variations">
            <p>No variations yet, create one!</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ElementDetail;
