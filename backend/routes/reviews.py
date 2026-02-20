"""Routes API pour les avis (CRUD) + analyse sentiment automatique."""
from flask import Blueprint, request, jsonify
from extensions import db
from models import Product, Review
from services.sentiment_service import SentimentService
from .auth import token_required

reviews_bp = Blueprint("reviews", __name__)


@reviews_bp.route("/<int:product_id>/reviews", methods=["GET"])
def list_reviews(product_id):
    """GET /api/products/:id/reviews - Liste les avis d'un produit."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews])


@reviews_bp.route("/<int:product_id>/reviews/mine", methods=["GET"])
@token_required
def my_review(current_user, product_id):
    """GET /api/products/:id/reviews/mine - Avis de l'utilisateur connecté pour ce produit (404 si aucun)."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    review = Review.query.filter_by(product_id=product_id, user_id=current_user.id).first()
    if not review:
        return jsonify({"error": "Aucun avis."}), 404
    return jsonify(review.to_dict())


@reviews_bp.route("/<int:product_id>/reviews", methods=["POST"])
@token_required
def create_review(current_user, product_id):
    """POST /api/products/:id/reviews - Ajoute un avis (1 par utilisateur et par produit). Body: { text, rating (1-5) }."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    # Un seul avis par produit pour les utilisateurs ; l'admin peut en poster autant qu'il veut
    if current_user.username != "admin":
        existing = Review.query.filter_by(product_id=product_id, user_id=current_user.id).first()
        if existing:
            return jsonify({"error": "Vous avez déjà posté un avis pour ce produit."}), 409
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
        user_id=current_user.id,
        text=text,
        rating=rating,
        sentiment=sentiment,
        sentiment_score=sentiment_score,
    )
    db.session.add(review)
    db.session.commit()
    return jsonify(review.to_dict()), 201
