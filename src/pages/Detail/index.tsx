import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.scss";
import { elementsMock } from "../../mockData/home";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface IElement {
  id: number;
  title: string;
  css: string;
  reactCode: string;
  html?: string;
}

const ElementDetail = () => {
  const { id } = useParams(); // lấy id từ URL (string)
  const elementId = Number(id); // chuyển sang number

  const [element, setElement] = useState<IElement | null>(null);
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  useEffect(() => {
    const el = elementsMock.find((e) => e.id === elementId);
    if (el) setElement(el);
  }, [elementId]);

  if (!element) return <div>Loading...</div>;

  return (
    <div className="detail">
      <Link to="/">⬅ Quay lại</Link>
      <h1>{element.title}</h1>

      <div className="row">
        <div className="preview">
          <iframe
            title={element.title}
            className="preview big"
            srcDoc={`<style>
              body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            }${element.css}</style>
            ${element.html}`}
          />
        </div>
        <div className="flex item">
          <div className="tablist"></div>
          <div>
            <div className="tab-header">
              <button
                className={activeTab === "html" ? "active" : ""}
                onClick={() => setActiveTab("html")}
              >
                HTML
              </button>
              <button
                className={activeTab === "css" ? "active" : ""}
                onClick={() => setActiveTab("css")}
              >
                CSS
              </button>
            </div>
          </div>
          <div className="tab-content">
            {activeTab === "html" && (
              <SyntaxHighlighter
                language="html"
                style={oneDark}
                showLineNumbers
              >
                {element.html ?? ""}
              </SyntaxHighlighter>
            )}

            {activeTab === "css" && (
              <SyntaxHighlighter language="css" style={oneDark} showLineNumbers>
                {element.css}
              </SyntaxHighlighter>
            )}
          </div>
        </div>
      </div>

      <h3>React Code</h3>
      <pre>{element.reactCode}</pre>
      <button onClick={() => navigator.clipboard.writeText(element.reactCode)}>
        Copy React
      </button>
    </div>
  );
};

export default ElementDetail;
