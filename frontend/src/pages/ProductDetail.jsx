import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productsApi, reviewsApi, statsApi, isAdmin, getAssetUrl } from "../api";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import StatsChart from "../components/StatsChart";
import Recommendations from "../components/Recommendations";
import AuthModal from "../components/AuthModal";

function ProductHeroImage({ product }) {
  const url = getAssetUrl(product?.image_url || product?.image);
  if (url) {
    return (
      <img
        src={url}
        alt={product.name}
        className="product-hero-image"
      />
    );
  }
  return (
    <div className="product-image-placeholder product-hero-placeholder" aria-hidden>
      <span role="img">📦</span>
    </div>
  );
}

export default function ProductDetail() {
  const { productId } = useParams();
  const { user } = useAuth();
  const admin = isAdmin(user);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchProductAndReviews = async () => {
    if (!productId) return;
    try {
      setError(null);
      const [prodRes, revRes] = await Promise.all([
        productsApi.get(productId),
        reviewsApi.list(productId),
      ]);
      setProduct(prodRes.data);
      setReviews(revRes.data);
    } catch (e) {
      setError(e.response?.data?.error || "Produit introuvable.");
    }
  };

  const fetchStatsAndRecommendations = async () => {
    if (!productId || !admin) return;
    try {
      const [statsRes, recRes] = await Promise.all([
        statsApi.get(productId).catch(() => ({ data: null })),
        statsApi.recommendations(productId).catch(() => ({ data: null })),
      ]);
      setStats(statsRes.data);
      setRecommendations(recRes.data);
    } catch {
      setStats(null);
      setRecommendations(null);
    }
  };

  const fetchMyReview = async () => {
    if (!productId || !user) return;
    try {
      const res = await reviewsApi.mine(productId);
      setMyReview(res.data);
    } catch {
      setMyReview(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      await fetchProductAndReviews();
      if (cancelled) return;
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [productId]);

  useEffect(() => {
    if (!productId || !admin) return;
    fetchStatsAndRecommendations();
  }, [productId, admin]);

  useEffect(() => {
    if (!productId || !user) {
      setMyReview(null);
      return;
    }
    fetchMyReview();
  }, [productId, user]);

  const handleReviewAdded = () => {
    fetchProductAndReviews();
    fetchMyReview();
    if (admin) fetchStatsAndRecommendations();
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    fetchMyReview();
  };

  if (loading) {
    return (
      <div className="page-header">
        <Link to="/" className="back-link">← Retour au catalogue</Link>
        <div className="product-hero-skeleton" />
        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          <p className="page-subtitle" style={{ margin: 0 }}>Chargement…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-header">
        <Link to="/" className="back-link">← Retour au catalogue</Link>
        <div className="card">
          <p className="error-msg">{error || "Produit introuvable."}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-header product-detail-page">
      <Link to="/" className="back-link">← Retour au catalogue</Link>

      <header className="product-hero">
        <div className="product-hero-media">
          <ProductHeroImage product={product} />
        </div>
        <div className="product-hero-content">
          <span className="product-hero-category">{product.category}</span>
          <h1 className="product-hero-title">{product.name}</h1>
          <p className="product-hero-desc">
            Analyse des avis clients et recommandations par intelligence artificielle.
          </p>
        </div>
      </header>

      <div className="product-detail-sections">
        {admin && stats && (
          <section className="card section-card">
            <h2 className="card-title">Statistiques des avis</h2>
            <StatsChart stats={stats} />
          </section>
        )}

        {admin && recommendations && (
          <section className="card section-card">
            <Recommendations data={recommendations} />
          </section>
        )}

        <section className="card section-card">
          <h2 className="card-title">Donner mon avis</h2>
          {myReview && !admin ? (
            <div className="already-reviewed">
              <p>Vous avez déjà posté un avis pour ce produit.</p>
              <div className="review-item">
                <div className="review-item-header">
                  <span className="review-rating">★ {myReview.rating}/5</span>
                  {myReview.sentiment && (
                    <span className={`sentiment-badge sentiment-${myReview.sentiment}`}>
                      {myReview.sentiment}
                    </span>
                  )}
                </div>
                <p className="review-text">{myReview.text}</p>
              </div>
            </div>
          ) : user ? (
            <ReviewForm productId={productId} onSuccess={handleReviewAdded} />
          ) : (
            <>
              <p className="review-cta-text">
                Connectez-vous ou créez un compte pour poster un avis (un seul par produit).
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowAuthModal(true)}
              >
                Créer un compte / Se connecter
              </button>
            </>
          )}
        </section>

        <section className="card section-card">
          <h2 className="card-title">Avis clients</h2>
          <ReviewList reviews={reviews} />
        </section>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
