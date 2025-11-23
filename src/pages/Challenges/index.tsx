import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";

interface IChallenge {
  _id: string;
  title: string;
  description: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "rating" | "completed";
  submissionsCount: number;
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
}

const Challenges = () => {
  const navigate = useNavigate();
  const [activeChallenges, setActiveChallenges] = useState<IChallenge[]>([]);
  const [previousChallenges, setPreviousChallenges] = useState<IChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const [activeRes, previousRes] = await Promise.all([
          fetch("http://localhost:3000/challenges/active"),
          fetch("http://localhost:3000/challenges/previous"),
        ]);

        const activeData = await activeRes.json();
        const previousData = await previousRes.json();

        setActiveChallenges(activeData);
        setPreviousChallenges(previousData);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    return `${hours} hour${hours > 1 ? "s" : ""} left`;
  };

  if (loading) {
    return (
      <div className="challenges-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="challenges">
      {/* Hero Section */}
      <section className="challenges-hero">
        <div className="challenges-hero__badge">🏆 SHOWCASE YOUR SKILLS</div>
        <h1 className="challenges-hero__title">UI Design Challenges</h1>
        <p className="challenges-hero__subtitle">
          Compete with your CSS & Tailwind skills, get rated by reviewers,
          <br />
          and win points to climb the leaderboard!
        </p>
      </section>

      {/* Active Challenges */}
      <section className="challenges-section">
        <div className="challenges-section__header">
          <h2>Active Challenges</h2>
          <span className="challenges-count">{activeChallenges.length}</span>
        </div>

        {activeChallenges.length === 0 ? (
          <div className="challenges-empty">
            <p>No active challenges at the moment. Check back soon! 🚀</p>
          </div>
        ) : (
          <div className="challenges-grid">
            {activeChallenges.map((challenge) => (
              <div
                key={challenge._id}
                className="challenge-card"
                onClick={() => navigate(`/challenges/${challenge._id}`)}
              >
                <div className="challenge-card__banner">
                  <img
                    src={challenge.bannerImage}
                    alt={challenge.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/600x300/7c3aed/ffffff?text=Challenge";
                    }}
                  />
                  <div className="challenge-card__status">
                    {challenge.status === "upcoming" ? (
                      <span className="badge badge--upcoming">Upcoming</span>
                    ) : (
                      <span className="badge badge--active">Active</span>
                    )}
                  </div>
                </div>

                <div className="challenge-card__content">
                  <h3 className="challenge-card__title">{challenge.title}</h3>
                  <p className="challenge-card__description">
                    {challenge.description}
                  </p>

                  <div className="challenge-card__meta">
                    <div className="challenge-card__deadline">
                      <span className="icon">⏰</span>
                      <span>{getTimeRemaining(challenge.endDate)}</span>
                    </div>
                    <div className="challenge-card__submissions">
                      <span className="icon">👥</span>
                      <span>{challenge.submissionsCount} entries</span>
                    </div>
                  </div>

                  <div className="challenge-card__prizes">
                    <span className="prize-label">Prizes:</span>
                    <div className="prize-amounts">
                      <span className="prize prize--first">
                        🥇 {challenge.firstPrize}
                      </span>
                      <span className="prize prize--second">
                        🥈 {challenge.secondPrize}
                      </span>
                      <span className="prize prize--third">
                        🥉 {challenge.thirdPrize}
                      </span>
                    </div>
                  </div>

                  <button className="challenge-card__cta">
                    Enter Challenge →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Previous Challenges */}
      <section className="challenges-section">
        <div className="challenges-section__header">
          <h2>Previous Challenges</h2>
          <span className="challenges-count">{previousChallenges.length}</span>
        </div>

        {previousChallenges.length === 0 ? (
          <div className="challenges-empty">
            <p>No previous challenges yet.</p>
          </div>
        ) : (
          <div className="challenges-grid challenges-grid--compact">
            {previousChallenges.map((challenge) => (
              <div
                key={challenge._id}
                className="challenge-card challenge-card--past"
                onClick={() => navigate(`/challenges/${challenge._id}`)}
              >
                <div className="challenge-card__banner">
                  <img
                    src={challenge.bannerImage}
                    alt={challenge.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/600x300/333333/ffffff?text=Ended";
                    }}
                  />
                  <div className="challenge-card__status">
                    <span className="badge badge--completed">Completed</span>
                  </div>
                </div>

                <div className="challenge-card__content">
                  <h3 className="challenge-card__title">{challenge.title}</h3>
                  <div className="challenge-card__meta">
                    <span className="challenge-card__date">
                      {formatDate(challenge.endDate)}
                    </span>
                    <span className="challenge-card__submissions">
                      {challenge.submissionsCount} entries
                    </span>
                  </div>
                  <button className="challenge-card__cta challenge-card__cta--secondary">
                    View Winners →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Challenges;
