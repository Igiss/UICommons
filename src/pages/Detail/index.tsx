import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.scss";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import ExportPopup from "../Detail/popupExport";
import { EditorView, lineNumbers } from "@codemirror/view";

export interface IElement {
  _id: string;
  title: string;
  htmlCode: string;
  cssCode: string;
  reactCode?: string;
  litCode?: string;
  svelteCode?: string;
  vueCode?: string;
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

  // 🟡 Thêm state quản lý yêu thích
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const token = localStorage.getItem("authToken");
  console.log("token:", token);
  const accountId = localStorage.getItem("accountId");
  useEffect(() => {
    if (!id) return;
    const fetchElementData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/components/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy component.");
        const data = await res.json();
        setElement({
          ...data,
          htmlCode: data.htmlCode || "",
          cssCode: data.cssCode || "",
        });

        // 🟢 Kiểm tra xem component này có trong favorites không
        const favRes = await fetch(
          `http://localhost:3000/favourites/check/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const favData = await favRes.json();
        setIsFavourite(favData.isFavourite);
      } catch (err) {
        console.error("Lỗi khi tải component:", err);
        setError("Không thể tải được dữ liệu cho component này.");
      } finally {
        setLoading(false);
      }
    };
    fetchElementData();
  }, [id, token]);

  // 🧩 Hàm toggle favourite
  const handleToggleFavourite = async () => {
    if (!id) return;
    try {
      const token = localStorage.getItem("authToken"); // tên key tùy bạn lưu khi login

      const res = await fetch("http://localhost:3000/favourites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🟢 Bắt buộc phải có
        },
        body: JSON.stringify({ componentId: id }), // accountId không cần gửi nữa
      });

      console.log("Sending favourite:", { accountId, componentId: id });

      const data = await res.json();
      setIsFavourite(data.isFavourite);
    } catch (err) {
      console.error("Lỗi khi toggle favourite:", err);
    }
  };

  if (loading)
    return <div className="detail-status">Đang tải component...</div>;
  if (error) return <div className="detail-status error">{error}</div>;
  if (!element)
    return <div className="detail-status">Không tìm thấy component.</div>;

  return (
    <div className="detail">
      <Link to="/elements">⬅ Quay lại danh sách</Link>
      <h1>{element.title}</h1>

      <div className="detail__row">
        {/* Preview */}
        <div className="detail__preview">
          <iframe
            title={element.title}
            className="preview-iframe"
            srcDoc={`<style>body {display:flex;justify-content:center;align-items:center;height:100vh;margin:0;overflow:hidden;}${
              element.cssCode ?? ""
            }</style>${element.htmlCode ?? ""}`}
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
                  value={element.htmlCode ?? ""}
                  theme={vscodeDark}
                  height="600px"
                  extensions={[html(), lineNumbers(), EditorView.lineWrapping]}
                  editable={false}
                  basicSetup={false}
                />
              )}
              {activeTab === "css" && (
                <CodeMirror
                  value={element.cssCode ?? ""}
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

      {/* 🧭 Action Bar */}
      <div className="detail__actions">
        {/* ⭐ Save to favourites */}
        <button className="action-btn" onClick={handleToggleFavourite}>
          <span style={{ color: isFavourite ? "#FFD700" : "#888" }}>
            {isFavourite ? "⭐" : "☆"}
          </span>{" "}
          {isFavourite ? "Đã lưu yêu thích" : "Lưu vào yêu thích"}
        </button>

        {/* Export */}
        <div className="export-group">
          <button
            className="action-btn"
            onClick={() => {
              let code = "";
              switch (selectedExport) {
                case "react":
                  code = element.reactCode || "Không có React code.";
                  break;
                case "vue":
                  code = element.vueCode || "Không có Vue code.";
                  break;
                case "svelte":
                  code = element.svelteCode || "Không có Svelte code.";
                  break;
                case "lit":
                  code = element.litCode || "Không có Lit code.";
                  break;
                default:
                  code = "Vui lòng chọn loại export.";
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
    </div>
  );
};

export default ElementDetail;
