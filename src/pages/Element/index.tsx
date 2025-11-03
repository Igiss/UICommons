import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ElementPreview from "../../components/ElementPreview";
import "../Element/style.scss";

export interface IElement {
  _id: string;
  title: string;
  htmlCode: string;
  cssCode: string;
  reactCode?: string;
  vueCode?: string;
  litCode?: string;
  svelteCode?: string;
  accountId: IAuthor | null; // backend có thể trả về object chứa fullName/username
  category?: string;
  status?: "draft" | "public";
  viewsCount?: number;
  favouritesCount?: number;
}
interface IAuthor {
  username: string;
  fullName: string;
  avatar: string;
}
const Elements = () => {
  const [elements, setElements] = useState<IElement[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/components");
        const data = await res.json();
        console.log("Fetched components:", data);
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

  const filtered = elements.filter((el) => {
    const matchSearch = el.title?.toLowerCase().includes(search.toLowerCase());
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
          {/* ... các <option> ... */}
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

      {/* Grid - Đã xóa div .home */}
      <div className="grid">
        {filtered.map((el) => (
          <div key={el._id} className="card-wrapper">
            <Link to={`/element/${el._id}`} className="card">
              <ElementPreview htmlCode={el.htmlCode} cssCode={el.cssCode} />
            </Link>

            <div className="meta">
              <div className="author">
                <strong>
                  {el.accountId?.fullName ||
                    el.accountId?.username ||
                    "Unknown"}
                </strong>
              </div>
              <div className="stats">
                <span>{el.viewsCount?.toLocaleString() || 0} views</span>
                <span>⭐ {el.favouritesCount || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Elements;
