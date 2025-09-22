import { useEffect, useRef } from "react";

interface ElementPreviewProps {
  html?: string;
  css: string;
}

const ElementPreview = ({ html = "", css }: ElementPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      let shadow = containerRef.current.shadowRoot;
      if (!shadow) {
        shadow = containerRef.current.attachShadow({ mode: "open" });
      }

      // Xóa nội dung cũ trước khi render mới
      shadow.innerHTML = "";

      // Tạo style riêng cho shadow DOM
      const style = document.createElement("style");
      style.textContent = `
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        ${css}
      `;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;

      shadow.appendChild(style);
      shadow.appendChild(wrapper);
    }
  }, [html, css]);

  return <div ref={containerRef} className="preview"></div>;
};

export default ElementPreview;
