import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";

import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { EditorView, lineNumbers } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { generateFrameworkCode } from "./codeGenerator";
import { getTemplate } from "./templates";
import { FiRefreshCw, FiSave, FiSend } from "react-icons/fi";

// 🧩 Danh sách loại component cố định
const CATEGORY_LIST = [
  "button",
  "toggle switch",
  "checkbox",
  "card",
  "loader",
  "input",
  "form",
  "pattern",
  "radio buttons",
  "tooltips",
];

const AddElement = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // 🧩 Khi chọn loại → tự điền code mẫu
  const handleSelectType = (type: string) => {
    const template = getTemplate(type);
    if (template) {
      setSelectedCategory(type);
      setTitle(template.title);
      setHtmlCode(template.html);
      setCssCode(template.css);
    } else {
      setSelectedCategory(type);
    }
    setShowPopup(false);
  };

  // 🧩 Cập nhật preview realtime
  useEffect(() => {
    const doc = `
      <style>
        html, body {
          height: 100%;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          
        }
        ${cssCode}
      </style>
      ${htmlCode}
    `;
    setPreviewSrc(doc);
  }, [htmlCode, cssCode]);

  const handleChangetype = () => {
    setShowPopup(true);
  };
  // 🧠 Gửi dữ liệu lên backend
  const handleSubmit = async (
    e: React.FormEvent,
    status: "draft" | "public" = "public"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const reactCode = generateFrameworkCode(htmlCode, cssCode, "react");
      const vueCode = generateFrameworkCode(htmlCode, cssCode, "vue");
      const svelteCode = generateFrameworkCode(htmlCode, cssCode, "svelte");
      const litCode = generateFrameworkCode(htmlCode, cssCode, "lit");

      const token = localStorage.getItem("authToken");
      const accountId = localStorage.getItem("accountId"); // 👈 lưu khi login

      if (!selectedCategory) throw new Error("Vui lòng chọn loại component!");

      const res = await fetch("http://localhost:3000/components", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          title: title || selectedCategory,
          htmlCode,
          cssCode,
          reactCode,
          vueCode,
          svelteCode,
          litCode,
          category: selectedCategory,
          status, // 👈 "draft" hoặc "public"
          accountId,
        }),
      });

      if (!res.ok) throw new Error("Không thể tạo element.");

      navigate("/elements");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="detail add-element">
      <Link to="/elements">⬅ Quay lại danh sách</Link>
      <h1>Tạo Element Mới</h1>

      {/* 🧩 POPUP chọn loại element */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-modern">
            <div className="popup-header">
              <h2>Chọn loại component</h2>
            </div>

            <div className="popup-grid">
              {CATEGORY_LIST.map((item) => (
                <div
                  key={item}
                  className={`popup-item ${
                    selectedCategory === item ? "selected" : ""
                  }`}
                  onClick={() => setSelectedCategory(item)}
                >
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="popup-footer">
              <button
                className="continue-btn"
                disabled={!selectedCategory}
                onClick={() => handleSelectType(selectedCategory)}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧱 Layout chính */}
      <div className="detail__row">
        {/* LEFT: Preview */}
        <div className="detail__preview">
          <iframe
            title="Preview"
            className="preview-iframe"
            srcDoc={previewSrc}
          />
        </div>

        {/* RIGHT: Code Editor */}
        <div className="detail__code-viewer">
          <form id="element-form" onSubmit={(e) => handleSubmit(e)}>
            <div className="form-group">
              <label>Tiêu đề</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Button Gradient"
              />
            </div>

            {/* Tabs HTML/CSS */}
            <div className="tabs">
              <div className="tabs__header">
                <button
                  type="button"
                  className={`tabs__button ${
                    activeTab === "html" ? "tabs__button--active" : ""
                  }`}
                  onClick={() => setActiveTab("html")}
                >
                  HTML
                </button>
                <button
                  type="button"
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
                    value={htmlCode}
                    height="500px"
                    theme={vscodeDark}
                    extensions={[
                      html(),
                      lineNumbers(),
                      EditorView.lineWrapping,
                    ]}
                    onChange={setHtmlCode}
                  />
                )}
                {activeTab === "css" && (
                  <CodeMirror
                    value={cssCode}
                    height="500px"
                    theme={vscodeDark}
                    extensions={[css(), lineNumbers(), EditorView.lineWrapping]}
                    onChange={setCssCode}
                  />
                )}
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}
          </form>
        </div>
      </div>
      <div className="form-actions">
        <button
          type="button"
          className="action-btn secondary"
          onClick={handleChangetype}
        >
          <FiRefreshCw />
          <span>Change type</span>
        </button>

        <button
          type="button"
          className="action-btn secondary"
          disabled={isSubmitting}
          onClick={(e) => handleSubmit(e, "draft")}
        >
          <FiSave />
          <span>Save as a draft</span>
        </button>

        <button
          type="submit"
          form="element-form"
          className="action-btn primary"
          disabled={isSubmitting}
        >
          <FiSend />
          <span>{isSubmitting ? "Submitting..." : "Submit for review"}</span>
        </button>
      </div>
    </div>
  );
};

export default AddElement;
