import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import { elementsMock } from "../../mockData/home";
import ElementPreview from "../../pages/ElementPreview";

export interface IElement {
  id: number;
  title: string;
  css: string;
  reactCode: string;
  html?: string;
}

const Home = () => {
  const [search, setSearch] = useState("");
  const [elements, setElements] = useState<IElement[]>([]);

  const filtered = elements.filter((el) =>
    el.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setElements(elementsMock);
    console.log("Render.........");
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
          <Link to={`/element/${el.id}`} key={el.id} className="card">
            <ElementPreview html={el.html} css={el.css} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
