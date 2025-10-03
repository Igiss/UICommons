// File: src/pages/Detail/index.tsx (Chỉ cần sửa 1 dòng)

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./style.scss"; // Đảm bảo bạn đã import file SCSS
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
export interface IElement {
  _id: string;
  title: string;
  htmlCode: string;
  cssCode: string;
  reactCode?: string;
}
export function CodeBlock({ code }: { code: string }) {
  return (
    <SyntaxHighlighter
      language="css"
      style={vscDarkPlus}
      showLineNumbers
      wrapLines // giữ thẳng hàng số dòng
      customStyle={{
        padding: "16px",
        borderRadius: "8px",
        fontSize: "14px",
        lineHeight: "1.6",
        overflowX: "auto", // thanh cuộn ngang
        whiteSpace: "pre", // giữ nguyên format VSCode
      }}
      lineNumberStyle={{
        minWidth: "2.5em", // số dòng canh thẳng
        paddingRight: "12px",
        textAlign: "right",
        opacity: 0.6,
        userSelect: "none",
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
const ElementDetail = () => {
  const { id } = useParams();
  const [element, setElement] = useState<IElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");

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
        setElement(data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu component:", err);
        setError("Không thể tải được dữ liệu cho component này.");
      } finally {
        setLoading(false);
      }
    };

    fetchElementData();
  }, [id]);

  if (loading) {
    return <div className="detail-status">Đang tải component...</div>;
  }

  if (error) {
    return <div className="detail-status error">{error}</div>;
  }

  if (!element) {
    return <div className="detail-status">Không tìm thấy component.</div>;
  }

  return (
    <div className="detail">
      <Link to="/elements">⬅ Quay lại danh sách</Link>
      <h1>{element.title}</h1>

      <div className="detail__row">
        <div className="detail__preview">
          <iframe
            title={element.title}
            className="preview-iframe"
            srcDoc={`<style>body {display: flex;justify-content: center;align-items: center;height: 100vh;margin: 0;}${
              element.cssCode ?? ""
            }</style>${element.htmlCode ?? ""}`}
          />
        </div>

        {/* ✅ THAY ĐỔI Ở ĐÂY: Đổi tên class để rõ nghĩa hơn */}
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
                <SyntaxHighlighter
                  language="html"
                  style={oneDark}
                  showLineNumbers
                  wrapLines={true}
                >
                  {element.htmlCode ?? ""}
                </SyntaxHighlighter>
              )}
              {activeTab === "css" && (
                <SyntaxHighlighter
                  language="css"
                  style={oneDark}
                  showLineNumbers
                  wrapLines={true}
                >
                  {element.cssCode ?? ""}
                </SyntaxHighlighter>
              )}
            </div>
          </div>
        </div>
      </div>

      {element.reactCode && (
        <div className="detail__react-code">
          <h3>React Code</h3>
          <SyntaxHighlighter language="jsx" style={oneDark} showLineNumbers>
            {element.reactCode}
          </SyntaxHighlighter>
          <button
            className="copy-button"
            onClick={() =>
              navigator.clipboard.writeText(element.reactCode ?? "")
            }
          >
            Copy React Code
          </button>
        </div>
      )}
    </div>
  );
};

export default ElementDetail;
