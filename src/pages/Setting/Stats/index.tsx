import React, { useEffect, useState } from "react";
import axios from "axios";

import "../../Setting/style.scss";
import "./style.scss";

const API_URL = "http://localhost:3000";

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="stat-card">
    <div className="card-title">{title}</div>
    <div className="card-value">{value}</div>
  </div>
);

const StatsPage = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalFavorites: 0,
    score: 0,
  });

  // ⚠️ [FIX 1]: Lấy đúng tên token "authToken"
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) return;

    // ⚠️ [FIX 2]: Đổi đường dẫn từ /profile/stats -> /setting/stats
    axios
      .get(`${API_URL}/setting/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load stats:", err));
  }, [token]);

  return (
    <>
      <div className="spgHeader">Stats</div>
      <div className="spgHint">Total stats across your profile</div>

      <div className="metrics-grid">
        <StatCard title="Total Posts" value={stats.totalPosts} />
        <StatCard title="Total Favorites" value={stats.totalFavorites} />
        <StatCard title="Score" value={stats.score} />
      </div>

      {/* Phần biểu đồ giữ nguyên (nếu bạn có dùng) */}
      <div className="chart-section-card">
        <div className="chart-header">
          <div className="chart-title">Favorites Over Time</div>
          <div className="chart-subtitle">
            Total favorites over last 30 days
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-y-axis">
            {[4, 3, 2, 1, 0].map((y) => (
              <div key={y} className="y-label">
                {y}
              </div>
            ))}
          </div>

          <div className="chart-drawing-area">
            <div className="mock-line-chart"></div>
            <div className="chart-x-axis">
              {[
                "20/10",
                "23/10",
                "26/10",
                "29/10",
                "1/11",
                "3/11",
                "5/11",
                "7/11",
              ].map((label, i) => (
                <div key={i} className="x-label">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsPage;
