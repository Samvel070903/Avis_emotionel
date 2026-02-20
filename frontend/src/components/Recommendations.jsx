export default function Recommendations({ data }) {
  if (!data) return null;

  return (
    <div className="recommendations">
      <h2 className="card-title">Recommandations d’amélioration</h2>
      {data.summary && (
        <p className="recommendations-summary">{data.summary}</p>
      )}
      {data.weak_points?.length > 0 && (
        <div className="recommendations-weak">
          <strong>Points faibles récurrents :</strong>{" "}
          {data.weak_points.join(", ")}
        </div>
      )}
      {(data.recommendations || []).length > 0 && (
        <ul className="recommendations-list">
          {(data.recommendations || []).map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
