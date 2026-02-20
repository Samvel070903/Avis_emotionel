"""Configuration de l'application Flask."""
import os

basedir = os.path.abspath(os.path.dirname(__file__))
ASSETS_DIR = os.path.join(basedir, "assets")


class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "ai_product_advisor.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ASSETS_DIR = ASSETS_DIR  # dossier où sont stockées les images produits

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_KEY", SECRET_KEY)
