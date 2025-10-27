import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Home/style.scss";
import ElementPreview from "../../components/ElementPreview";

export interface IElement {
  _id: string;
  title: string;
  htmlCode: string;
  cssCode: string;
  reactCode?: string;
  vueCode?: string;
  litCode?: string;
  svelteCode?: string;
  accountId: string;
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
      <section className="hero">
        <p className="hero-badge">🚀 9 NEW ELEMENTS THIS WEEK!</p>
        <h1 className="hero-title">
          The Largest Library <br /> of Open-Source UI
        </h1>
        <p className="hero-subtitle">
          Community-built library of UI elements.
          <br />
          Copy as HTML/CSS, Tailwind, React and Figma.
        </p>

        <div className="hero-search">
          <input
            type="text"
            placeholder="Search for components, styles, creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>Search</button>
        </div>
      </section>

      <div className="grid">
        {filtered.map((el) => (
          <Link to={`/element/${el._id}`} key={el._id} className="card">
            <ElementPreview htmlCode={el.htmlCode} cssCode={el.cssCode} />
            <span className="card-copy">{"</>"} Get code</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
