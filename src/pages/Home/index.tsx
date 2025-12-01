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
        <p className="hero-badge">🚀 3 THÀNH PHẦN MỚI TUẦN NÀY!</p>
        <h1 className="hero-title">
          Thư Viện Mã Nguồn Mở Lớn Nhất<br /> Cho UI
        </h1>
        <p className="hero-subtitle">
          Thư viện UI được tạo bởi cộng đồng
          <br />
          Lưu lại HTML/CSS, Tailwind, React và Figma.
        </p>

        <div className="hero-search">
          <input
            type="text"
            placeholder="Tìm kiếm thành phần, người dùng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>Tìm kiếm</button>
        </div>
      </section>

      <div className="grid">
        {filtered.map((el) => (
          <Link to={`/element/${el._id}`} key={el._id} className="card">
            <ElementPreview htmlCode={el.htmlCode} cssCode={el.cssCode} />
            <span className="card-copy">{"</>"} Lấy code</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
