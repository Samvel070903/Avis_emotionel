"""Routes API pour statistiques et recommandations (admin uniquement)."""
from flask import Blueprint, jsonify
from models import Product, Review
from services.recommendation_service import get_recommendations
from .auth import admin_required

stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/products/<int:product_id>/stats", methods=["GET"])
@admin_required
def product_stats(current_user, product_id):
    """GET /api/products/:id/stats - Statistiques (admin)."""
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
@admin_required
def product_recommendations(current_user, product_id):
    """GET /api/products/:id/recommendations - Recommandations (admin)."""
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
