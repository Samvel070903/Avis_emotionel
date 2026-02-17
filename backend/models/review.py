"""Modèle Review."""
from datetime import datetime
from extensions import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1..5
    sentiment = db.Column(db.String(20), nullable=True)   # positif / neutre / négatif (IA)
    sentiment_score = db.Column(db.Float, nullable=True)  # score de confiance (IA)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "text": self.text,
            "rating": self.rating,
            "sentiment": self.sentiment,
            "sentiment_score": self.sentiment_score,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
