import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ElementPreview from "../../pages/ElementPreview";
import "../Element/style.scss";
export interface IElement {
  _id: string; // Mongo trả về _id (uuid string)
  title: string; // giữ nguyên
  htmlCode: string; // đổi từ html -> htmlCode
  cssCode: string; // đổi từ css -> cssCode
  reactCode?: string; // optional
  vueCode?: string;
  litCode?: string;
  svelteCode?: string;
  accountId: string; // ai tạo component này
  category?: string;
  status?: "draft" | "public";
}

const Elements = () => {
  const [elements, setElements] = useState<IElement[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all"); // ✅ bộ lọc

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/components");
        const data = await res.json();
        const publicElements = data.filter(
          (el: IElement) => el.status === "public"
        );
        setElements(publicElements);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
          <option value="toggle switch">Toggle Switch</option>
          <option value="checkbox">Checkbox</option>
          <option value="card">Card</option>
          <option value="loader">Loader</option>
          <option value="input">Input</option>
          <option value="form">Form</option>
          <option value="pattern">Pattern</option>
          <option value="radio buttons">Radio Buttons</option>
          <option value="tooltips">Tooltips</option>
        </select>
      </div>

      {/* Grid */}
      <div className="home">
        <div className="grid">
          {filtered.map((el) => (
            <Link to={`/element/${el._id}`} key={el._id} className="card">
              <ElementPreview htmlCode={el.htmlCode} cssCode={el.cssCode} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Elements;
