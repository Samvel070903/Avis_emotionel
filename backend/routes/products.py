"""Routes API pour les produits (CRUD)."""
import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from extensions import db
from models import Product
from .auth import admin_required

products_bp = Blueprint("products", __name__)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[-1].lower() in ALLOWED_EXTENSIONS


@products_bp.route("/", methods=["GET"])
def list_products():
    """GET /api/products - Liste tous les produits (public)."""
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([p.to_dict() for p in products])


@products_bp.route("/", methods=["POST"])
@admin_required
def create_product(current_user):
    """POST /api/products - Crée un produit. Body: JSON { name, category } ou multipart (name, category, image)."""
    name = ""
    category = ""
    image_url = None

    if request.content_type and "multipart/form-data" in request.content_type:
        name = (request.form.get("name") or "").strip()
        category = (request.form.get("category") or "").strip()
        file = request.files.get("image")
        if file and file.filename and allowed_file(file.filename):
            assets_dir = current_app.config.get("ASSETS_DIR")
            if not assets_dir:
                assets_dir = os.path.join(current_app.root_path, "assets")
            os.makedirs(assets_dir, exist_ok=True)
            ext = file.filename.rsplit(".", 1)[-1].lower()
            filename = f"{uuid.uuid4().hex}.{ext}"
            filepath = os.path.join(assets_dir, filename)
            file.save(filepath)
            image_url = f"/api/assets/{filename}"
    else:
        data = request.get_json() or {}
        name = (data.get("name") or "").strip()
        category = (data.get("category") or "").strip()

    if not name:
        return jsonify({"error": "Le nom du produit est obligatoire."}), 400
    if not category:
        return jsonify({"error": "La catégorie est obligatoire."}), 400

    product = Product(name=name, category=category, image_url=image_url)
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
@admin_required
def delete_product(current_user, product_id):
    """DELETE /api/products/:id - Supprime un produit et ses avis (admin)."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404
    db.session.delete(product)
    db.session.commit()
    return "", 204


@products_bp.route("/<int:product_id>", methods=["PUT", "PATCH"])
@admin_required
def update_product(current_user, product_id):
    """PUT /api/products/:id - Modifie un produit (admin). Body: JSON { name?, category? } ou multipart + image."""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Produit introuvable."}), 404

    if request.content_type and "multipart/form-data" in request.content_type:
        if request.form.get("name") is not None:
            name = (request.form.get("name") or "").strip()
            if not name:
                return jsonify({"error": "Le nom ne peut pas être vide."}), 400
            product.name = name
        if request.form.get("category") is not None:
            product.category = (request.form.get("category") or "").strip()
        file = request.files.get("image")
        if file and file.filename and allowed_file(file.filename):
            assets_dir = current_app.config.get("ASSETS_DIR")
            if not assets_dir:
                assets_dir = os.path.join(current_app.root_path, "assets")
            os.makedirs(assets_dir, exist_ok=True)
            ext = file.filename.rsplit(".", 1)[-1].lower()
            filename = f"{uuid.uuid4().hex}.{ext}"
            filepath = os.path.join(assets_dir, filename)
            file.save(filepath)
            product.image_url = f"/api/assets/{filename}"
    else:
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
