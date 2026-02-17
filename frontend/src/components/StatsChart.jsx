import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const SENTIMENT_COLORS = { positif: "#22ff00", neutre: "#6b728081", négatif: "#ff0000" };

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
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
        <div className="card" style={{ marginBottom: 0, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>
            {stats.total_reviews}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Total avis</div>
        </div>
        <div className="card" style={{ marginBottom: 0, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            {stats.average_rating?.toFixed(1) ?? "—"}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Moyenne des notes</div>
        </div>
      </div>
      <div style={{ maxWidth: 320, margin: "0 auto 1rem" }}>
        <Pie data={pieData} options={options} />
      </div>
      <div style={{ maxHeight: 220 }}>
        <Bar data={barData} options={{ ...options, scales: { y: { beginAtZero: true } } }} />
      </div>
    </div>
  );
}
