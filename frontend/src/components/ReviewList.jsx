export default function ReviewList({ reviews }) {
  if (!reviews?.length) {
    return <p style={{ color: "var(--text-muted)" }}>Aucun avis pour l’instant.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {reviews.map((r) => (
        <li
          key={r.id}
          style={{
            padding: "1rem 0",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <span style={{ fontWeight: 600 }}>★ {r.rating}/5</span>
            {r.sentiment && (
              <span className={`sentiment-badge sentiment-${r.sentiment}`}>
                {r.sentiment}
                {r.sentiment_score != null && ` (${Math.round(r.sentiment_score * 100)}%)`}
              </span>
            )}
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              {r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR") : ""}
            </span>
          </div>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{r.text}</p>
        </li>
      ))}
    </ul>
  );
}
