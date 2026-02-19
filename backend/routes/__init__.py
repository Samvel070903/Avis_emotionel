"""Routes API REST."""
from .products import products_bp
from .reviews import reviews_bp
from .stats import stats_bp
from .auth import auth_bp

__all__ = ["products_bp", "reviews_bp", "stats_bp", "auth_bp"]
