"""Routes API pour les avis (CRUD) + analyse sentiment automatique."""
from flask import Blueprint, request, jsonify
from extensions import db
from models import Product, Review
from services.sentiment_service import SentimentService

reviews_bp = Blueprint("reviews", __name__)


@reviews_bp.route("/<int:product_id>/reviews", methods=["GET"])
def list_reviews(product_id):
    """GET /api/products/:id/reviews - Liste les avis d'un produit."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews])


@reviews_bp.route("/<int:product_id>/reviews", methods=["POST"])
def create_review(product_id):
    """POST /api/products/:id/reviews - Ajoute un avis. Body: { text, rating (1-5) }. Sentiment IA calculé automatiquement."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    data = request.get_json() or {}
    text = (data.get("text") or "").strip()
    rating = data.get("rating")
    if not text:
        return jsonify({"error": "Le texte de l'avis est obligatoire."}), 400
    try:
        rating = int(rating)
    except (TypeError, ValueError):
        return jsonify({"error": "La note doit être un entier entre 1 et 5."}), 400
    if rating < 1 or rating > 5:
        return jsonify({"error": "La note doit être entre 1 et 5."}), 400
    sentiment, sentiment_score = SentimentService.analyze(text)
    review = Review(
        product_id=product_id,
        text=text,
        rating=rating,
        sentiment=sentiment,
        sentiment_score=sentiment_score,
    )
    db.session.add(review)
    db.session.commit()
    return jsonify(review.to_dict()), 201
