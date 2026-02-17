import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productsApi, reviewsApi, statsApi } from "../api";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import StatsChart from "../components/StatsChart";
import Recommendations from "../components/Recommendations";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    if (!productId) return;
    try {
      setError(null);
      const [prodRes, revRes, statsRes, recRes] = await Promise.all([
        productsApi.get(productId),
        reviewsApi.list(productId),
        statsApi.get(productId).catch(() => ({ data: null })),
        statsApi.recommendations(productId).catch(() => ({ data: null })),
      ]);
      setProduct(prodRes.data);
      setReviews(revRes.data);
      setStats(statsRes.data);
      setRecommendations(recRes.data);
    } catch (e) {
      setError(e.response?.data?.error || "Produit introuvable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [productId]);

  const handleReviewAdded = () => {
    fetchAll();
  };

  if (loading) return <p className="card">Chargement…</p>;
  if (error || !product) {
    return (
      <div className="card">
        <p className="error-msg">{error || "Produit introuvable."}</p>
        <Link to="/">Retour aux produits</Link>
      </div>
    );
  }

  return (
    <>
      <p style={{ marginBottom: "0.5rem" }}>
        <Link to="/">← Produits</Link>
      </p>
      <h1 className="page-title">{product.name}</h1>
      <p style={{ color: "var(--text-muted)", marginTop: "-0.75rem", marginBottom: "1.5rem" }}>
        Catégorie : {product.category}
      </p>

      {stats && (
        <section className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.2rem" }}>Statistiques</h2>
          <StatsChart stats={stats} />
        </section>
      )}

      {recommendations && (
        <section className="card" style={{ marginBottom: "1.5rem" }}>
          <Recommendations data={recommendations} />
        </section>
      )}

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1.2rem" }}>Ajouter un avis</h2>
        <ReviewForm productId={productId} onSuccess={handleReviewAdded} />
      </section>

      <section className="card">
        <h2 style={{ margin: "0 0 1rem", fontSize: "1.2rem" }}>Avis clients</h2>
        <ReviewList reviews={reviews} />
      </section>
    </>
  );
}
