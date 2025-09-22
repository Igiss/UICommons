import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { elementsMock } from "../../mockData/home"; // dữ liệu giả
import "../Element/style.scss";

export interface IElement {
  id: number;
  title: string;
  category?: string; // ✅ thêm category để lọc
  css: string;
  reactCode: string;
  html?: string;
}

const Elements = () => {
  const [elements, setElements] = useState<IElement[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all"); // ✅ bộ lọc

  useEffect(() => {
    setElements(elementsMock);
  }, []);

  // Lọc dữ liệu
  const filtered = elements.filter((el) => {
    const matchSearch = el.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || el.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="elements-page">
      <h1>All Elements</h1>

      {/* Bộ lọc */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search element..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="button">Button</option>
          <option value="card">Card</option>
          <option value="form">Form</option>
          <option value="nav">Navigation</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid">
        {filtered.map((el) => (
          <Link to={`/element/${el.id}`} key={el.id} className="card">
            <iframe
              title={el.title}
              className="preview"
              srcDoc={`
                <html>
                  <head>
                    <style>
                      body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                      }
                      ${el.css}
                    </style>
                  </head>
                  <body>
                    ${el.html}
                  </body>
                </html>
              `}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Elements;
