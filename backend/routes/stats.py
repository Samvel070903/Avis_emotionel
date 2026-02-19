"""Routes API pour statistiques et recommandations."""
from flask import Blueprint, jsonify
from models import Product, Review
from services.recommendation_service import get_recommendations
from .auth import token_required

stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/products/<int:product_id>/stats", methods=["GET"])
@token_required
def product_stats(current_user, product_id):
    """GET /api/products/:id/stats - Statistiques d'un produit (nb avis, répartition sentiment, moyenne notes).

    Accès réservé à l'admin (seul l'admin voit le score de positivité).
    """
    # Règle ultra simple : l'utilisateur dont le nom est "admin" est considéré comme admin.
    if not current_user or current_user.username != "admin":
        return jsonify({"error": "Accès réservé à l'admin."}), 403
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    reviews = Review.query.filter_by(product_id=product_id).all()
    total = len(reviews)
    pos = sum(1 for r in reviews if r.sentiment == "positif")
    neu = sum(1 for r in reviews if r.sentiment == "neutre")
    neg = sum(1 for r in reviews if r.sentiment == "négatif")
    avg_rating = round(sum(r.rating for r in reviews) / total, 2) if total else 0
    return jsonify({
        "product_id": product_id,
        "total_reviews": total,
        "sentiment_distribution": {"positif": pos, "neutre": neu, "négatif": neg},
        "average_rating": avg_rating,
    })


@stats_bp.route("/products/<int:product_id>/recommendations", methods=["GET"])
def product_recommendations(product_id):
    """GET /api/products/:id/recommendations - Recommandations basées sur les avis négatifs."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    negative_reviews = Review.query.filter_by(
        product_id=product_id,
        sentiment="négatif",
    ).all()
    texts = [r.text for r in negative_reviews]
    result = get_recommendations(texts, max_recommendations=5)
    return jsonify(result)
