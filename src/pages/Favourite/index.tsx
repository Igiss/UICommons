import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import ElementPreview from "../../components/ElementPreview";

interface IAuthor {
  username: string;
  fullName: string;
  avatar: string;
}

interface IComponent {
  _id: string;
  title: string;
  htmlCode: string;
  cssCode: string;
  accountId: IAuthor | null; // cho chắc
  viewsCount?: number;
  favouritesCount?: number;
}

const FavouritePage = () => {
  const [favourites, setFavourites] = useState<IComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("http://localhost:3000/favourites/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: IComponent[]) => {
        setFavourites(data);
      })
      .catch((err) => console.error("Fetch favourites failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="fav-loading">Loading favourites...</div>;

  return (
    <div className="favourites-page">
      <h1 className="fav-title">My Favorites</h1>

      {favourites.length === 0 ? (
        <div className="empty-fav">
          <p>You haven’t added any favourites yet.</p>
        </div>
      ) : (
        <div className="fav-grid">
          {favourites.map((el) => (
            <div className="fav-card" key={el._id}>
              <Link to={`/element/${el._id}`} className="fav-link">
                <ElementPreview htmlCode={el.htmlCode} cssCode={el.cssCode} />
              </Link>

              <div className="fav-meta">
                <div className="fav-author">
                  <strong>
                    {el.accountId?.fullName ||
                      el.accountId?.username ||
                      "Unknown"}
                  </strong>
                </div>
                <div className="fav-stats">
                  <span>{el.viewsCount?.toLocaleString() || 0} views</span>
                  <span>⭐ {el.favouritesCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritePage;
