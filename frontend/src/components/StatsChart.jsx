import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const SENTIMENT_COLORS = {
  positif: "#0d9488",
  neutre: "#94a3b8",
  négatif: "#dc2626",
};

export default function StatsChart({ stats }) {
  const dist = stats.sentiment_distribution || {};
  const labels = ["positif", "neutre", "négatif"];
  const data = labels.map((l) => dist[l] ?? 0);

  const pieData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: labels.map((l) => SENTIMENT_COLORS[l]),
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Nombre d'avis",
        data,
        backgroundColor: labels.map((l) => SENTIMENT_COLORS[l]),
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="stats-chart">
      <div className="stats-kpis">
        <div className="stats-kpi">
          <span className="stats-kpi-value">{stats.total_reviews}</span>
          <span className="stats-kpi-label">Total avis</span>
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-value">
            {stats.average_rating != null ? stats.average_rating.toFixed(1) : "—"}
          </span>
          <span className="stats-kpi-label">Moyenne des notes</span>
        </div>
      </div>
      <div className="stats-pie-wrap">
        <Pie data={pieData} options={options} />
      </div>
      <div className="stats-bar-wrap">
        <Bar
          data={barData}
          options={{
            ...options,
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>
    </div>
  );
}
