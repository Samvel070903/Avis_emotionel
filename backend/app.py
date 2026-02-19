"""Application Flask - AI Product Advisor."""
import os
from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    with app.app_context():
        from models import Product, Review
        db.create_all()

    from routes import products_bp, reviews_bp, stats_bp, auth_bp
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(reviews_bp, url_prefix="/api/products")
    app.register_blueprint(stats_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
