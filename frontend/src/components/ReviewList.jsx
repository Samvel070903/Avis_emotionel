export default function ReviewList({ reviews }) {
  if (!reviews?.length) {
    return (
      <p className="review-list-empty">
        Aucun avis pour l’instant. Soyez le premier à donner votre avis.
      </p>
    );
  }

  return (
    <ul className="review-list">
      {reviews.map((r) => (
        <li key={r.id} className="review-item">
          <div className="review-item-header">
            <span className="review-rating">★ {r.rating}/5</span>
            {r.sentiment && (
              <span className={`sentiment-badge sentiment-${r.sentiment}`}>
                {r.sentiment}
                {r.sentiment_score != null && ` (${Math.round(r.sentiment_score * 100)}%)`}
              </span>
            )}
            <span className="review-date">
              {r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric"
              }) : ""}
            </span>
          </div>
          <p className="review-text">{r.text}</p>
        </li>
      ))}
    </ul>
  );
}
