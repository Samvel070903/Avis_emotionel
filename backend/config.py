"""Configuration de l'application Flask."""
import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join( basedir, "ai_product_advisor.db" )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
