import { useState } from "react";
import { reviewsApi } from "../api";

export default function ReviewForm({ productId, onSuccess }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim()) {
      setError("Le texte de l’avis est obligatoire.");
      return;
    }
    setLoading(true);
    try {
      await reviewsApi.create(productId, { text: text.trim(), rating });
      setText("");
      setRating(5);
      onSuccess();
    } catch (e) {
      setError(e.response?.data?.error || "Erreur lors de l’ajout de l’avis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label>Votre avis</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Décrivez votre expérience avec ce produit…"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Note (1 à 5 étoiles)</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          disabled={loading}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} étoile{n > 1 ? "s" : ""}</option>
          ))}
        </select>
      </div>
      <p className="review-form-hint">
        L’analyse de sentiment (IA) est calculée automatiquement à l’envoi.
      </p>
      {error && <p className="error-msg">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Envoi…" : "Publier l’avis"}
      </button>
    </form>
  );
}
