"""Services métier (IA, recommandations)."""
from .sentiment_service import SentimentService
from .recommendation_service import get_recommendations

__all__ = ["SentimentService", "get_recommendations"]
