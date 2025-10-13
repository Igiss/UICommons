import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.scss";

// CodeMirror
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

  useEffect(() => {
    if (!id) return;
    const fetchElementData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:3000/components/${id}`);
        if (!res.ok) {
          throw new Error("Không tìm thấy component.");
        }
        const data = await res.json();
        const decodedData = {
          ...data,
          htmlCode: data.htmlCode || "",
          cssCode: data.cssCode || "",
        };
        setElement(decodedData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu component:", err);
        setError("Không thể tải được dữ liệu cho component này.");
      } finally {
        setLoading(false);
      }
    };
    fetchElementData();
  }, [id]);

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
            srcDoc={`<style>body {display: flex;justify-content: center;align-items: center;height: 100vh;margin: 0;overflow: hidden;}${
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
                  height="500px"
                  theme={vscodeDark}
                  extensions={[html(), lineNumbers(), EditorView.lineWrapping]}
                  editable={false}
                  basicSetup={false}
                />
              )}
              {activeTab === "css" && (
                <CodeMirror
                  value={element.cssCode ?? ""}
                  height="500px"
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

      {/* React code nếu có */}
      {/* 🔽 Action Bar (Save / Copy / Export) */}
      <div className="detail__actions">
        <button className="action-btn">
          <span>⭐</span> Save to favorites
        </button>

        <button className="action-btn">
          <img src="/figma-icon.svg" alt="Figma" width="16" height="16" />
          Copy to Figma
        </button>

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
            <option value="d">Lit</option>
          </select>
        </div>

        {/* Popup */}
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
