import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import { elementsMock } from "../../mockData/home";

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
  // search => Biến lưu dữ liệu
  // setSearch => Function để set lại dữ liệu của biến "search"

  const filtered = elements.filter((el) =>
    el.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setElements(elementsMock);
    console.log("REnder........."); // KHi nào cần thực hiện tác vụ trước khi render UI
  }, []); // [] mặc định khi component này render thì nó sẽ chạy lần đầu

  return (
    <div className="home">
      <h1>Uiverse</h1>

      <input
        type="text"
        placeholder="🔍 Tìm component..."
        value={search}
        onChange={(e) => {
          console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~ e.target.value:", e.target.value);
          setSearch(e.target.value);
        }}
        className="search"
      />

      <div className="grid">
        {filtered.map((el) => (
          <Link to={`/element/${el.id}`} key={el.id} className="card">
            <iframe
              title={el.title}
              className="preview"
              srcDoc={`<style>${el.css}</style>${el.html}`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
