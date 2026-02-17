"""Routes API pour les produits (CRUD)."""
from flask import Blueprint, request, jsonify
from extensions import db
from models import Product

products_bp = Blueprint("products", __name__)


@products_bp.route("", methods=["GET"])
def list_products():
    """GET /api/products - Liste tous les produits."""
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([p.to_dict() for p in products])


@products_bp.route("", methods=["POST"])
def create_product():
    """POST /api/products - Crée un produit. Body: { name, category }."""
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    category = (data.get("category") or "").strip()
    if not name:
        return jsonify({"error": "Le nom du produit est obligatoire."}), 400
    if not category:
        return jsonify({"error": "La catégorie est obligatoire."}), 400
    product = Product(name=name, category=category)
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    """GET /api/products/:id - Détail d'un produit."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    return jsonify(product.to_dict())


@products_bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    """DELETE /api/products/:id - Supprime un produit et ses avis."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    db.session.delete(product)
    db.session.commit()
    return "", 204


@products_bp.route("/<int:product_id>", methods=["PUT", "PATCH"])
def update_product(product_id):
    """PUT /api/products/:id - Modifie un produit. Body: { name?, category? }."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    data = request.get_json() or {}
    if "name" in data and data["name"] is not None:
        name = str(data["name"]).strip()
        if not name:
            return jsonify({"error": "Le nom ne peut pas être vide."}), 400
        product.name = name
    if "category" in data and data["category"] is not None:
        product.category = str(data["category"]).strip()
    db.session.commit()
    return jsonify(product.to_dict())
