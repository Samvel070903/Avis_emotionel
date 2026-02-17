export default function Recommendations({ data }) {
  if (!data) return null;

  return (
    <>
      <h2 style={{ margin: "0 0 1rem", fontSize: "1.2rem" }}>Recommandations d’amélioration</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>{data.summary}</p>
      {data.weak_points?.length > 0 && (
        <p style={{ marginBottom: "1rem" }}>
          <strong>Points faibles récurrents :</strong>{" "}
          {data.weak_points.join(", ")}
        </p>
      )}
      <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
        {(data.recommendations || []).map((rec, i) => (
          <li key={i} style={{ marginBottom: "0.5rem" }}>{rec}</li>
        ))}
      </ul>
    </>
  );
}
