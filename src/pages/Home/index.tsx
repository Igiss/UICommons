import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

import ElementPreview from "../../pages/ElementPreview";

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
  status?: "draft" | "public" | "review" | "rejected";
}

const Home = () => {
  const [search, setSearch] = useState("");
  const [elements, setElements] = useState<IElement[]>([]);

  const filtered = elements.filter((el) =>
    el.title.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <div className="home">
      <input
        type="text"
        placeholder="Tìm component..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      <div className="grid">
        {filtered.map((el) => (
          <Link to={`/element/${el._id}`} key={el._id} className="card">
            <ElementPreview htmlCode={el.htmlCode} cssCode={el.cssCode} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
