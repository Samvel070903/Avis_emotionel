"""Service d'analyse de sentiment avec Hugging Face Transformers."""
from typing import Tuple

# Mapping des labels du modèle vers français
LABEL_MAP = {
    "positive": "positif",
    "neutral": "neutre",
    "negative": "négatif",
    "positif": "positif",
    "neutre": "neutre",
    "négatif": "négatif",
}


class SentimentService:
    _pipe = None

    @classmethod
    def _get_model(cls):
        if cls._pipe is None:
            from transformers import pipeline
            # Modèle multilingue 
            cls._pipe = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-xlm-roberta-base-sentiment",
                top_k=1,
            )
        return cls._pipe

    @classmethod
    def analyze(cls, text: str) -> Tuple[str, float]:
        """
        Analyse le sentiment d'un texte.
        Retourne (classe, score_confiance).
        Classe : 'positif' | 'neutre' | 'négatif'
        """
        if not text or not str(text).strip():
            return "neutre", 0.0
        text_clean = str(text).strip()[:512]  # limite pour le modèle
        try:
            pipe = cls._get_model()
            out = pipe(text_clean)
            # Selon la version/entrée : [dict] ou [[dict, ...]] (liste de prédictions)
            raw = out[0]
            if isinstance(raw, list):
                raw = raw[0] if raw else {}
            if not isinstance(raw, dict):
                return "neutre", 0.0
            label = str(raw.get("label", "")).strip().lower()
            score = float(raw.get("score", 0.0))
            class_fr = LABEL_MAP.get(label, label)
            if class_fr not in ("positif", "neutre", "négatif"):
                class_fr = "neutre"
            return class_fr, round(score, 4)
        except Exception as e:
            print("Erreur lors de l'analyse de sentiment pour le texte:", text_clean[:80], e)
            return "neutre", 0.0
