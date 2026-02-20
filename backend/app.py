"""Application Flask - AI Product Advisor."""
import os
from flask import Flask, send_from_directory
from flask_cors import CORS

from config import Config
from extensions import db


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config["ASSETS_DIR"] = getattr(config_class, "ASSETS_DIR", None) or os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "assets"
    )
    os.makedirs(app.config["ASSETS_DIR"], exist_ok=True)

    app.url_map.strict_slashes = False
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    with app.app_context():
        from models import Product, Review
        db.create_all()
        from sqlalchemy import text
        try:
            with db.engine.connect() as conn:
                conn.execute(text("ALTER TABLE reviews ADD COLUMN user_id INTEGER REFERENCES users(id)"))
                conn.commit()
        except Exception:
            pass
        try:
            with db.engine.connect() as conn:
                conn.execute(text("ALTER TABLE products ADD COLUMN image_url VARCHAR(500)"))
                conn.commit()
        except Exception:
            pass

    from routes import products_bp, reviews_bp, stats_bp, auth_bp
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(reviews_bp, url_prefix="/api/products")
    app.register_blueprint(stats_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route("/api/assets/<path:filename>")
    def serve_asset(filename):
        """Sert les fichiers du dossier assets (images produits)."""
        assets_dir = app.config["ASSETS_DIR"]
        return send_from_directory(assets_dir, filename)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
