"""Service de recommandations à partir des avis négatifs (règles + mots clés)."""
import re
from collections import Counter
from typing import List, Dict, Any


# Mots vides à ignorer pour l'extraction de mots clés
STOP_WORDS = {
    "le", "la", "les", "un", "une", "des", "du", "de", "et", "est", "en", "au", "aux",
    "ce", "ces", "cet", "cette", "son", "sa", "ses", "mon", "ma", "mes", "notre", "votre",
    "leur", "que", "qui", "quoi", "dont", "où", "par", "pour", "avec", "sans", "sous",
    "sur", "dans", "chez", "mais", "ou", "donc", "or", "ni", "car", "ne", "pas", "plus",
    "très", "trop", "bien", "mal", "peu", "tout", "tous", "toute", "toutes", "autre",
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has",
    "had", "do", "does", "did", "will", "would", "could", "should", "may", "might",
    "must", "shall", "can", "need", "dare", "to", "of", "in", "for", "on", "with",
    "at", "by", "from", "as", "into", "through", "during", "before", "after",
}


# Mapping thèmes récurrents -> recommandations
THEME_RECOMMENDATIONS = {
    "batterie": "Améliorer l'autonomie ou la durée de vie de la batterie (tests, communication claire sur l'autonomie).",
    "battery": "Améliorer l'autonomie ou la durée de vie de la batterie (tests, communication claire sur l'autonomie).",
    "qualité": "Renforcer le contrôle qualité et les matériaux (audits fournisseurs, tests renforcés).",
    "quality": "Renforcer le contrôle qualité et les matériaux (audits fournisseurs, tests renforcés).",
    "livraison": "Optimiser la logistique et la communication sur les délais (suivi en temps réel, SAV livraison).",
    "delivery": "Optimiser la logistique et la communication sur les délais (suivi en temps réel, SAV livraison).",
    "prix": "Revoir la politique tarifaire ou la valeur perçue (promos ciblées, bundling).",
    "price": "Revoir la politique tarifaire ou la valeur perçue (promos ciblées, bundling).",
    "son": "Améliorer la qualité audio (tuning, support haute résolution si pertinent).",
    "sound": "Améliorer la qualité audio (tuning, support haute résolution si pertinent).",
    "confort": "Travailler l'ergonomie et le confort d'utilisation (tests utilisateurs).",
    "comfort": "Travailler l'ergonomie et le confort d'utilisation (tests utilisateurs).",
    "design": "Affiner le design et le fini produit (retours clients, tendances).",
    "sav": "Renforcer le SAV et la réactivité (process, formation, FAQ).",
    "support": "Renforcer le SAV et la réactivité (process, formation, FAQ).",
    "notice": "Améliorer la notice et le packaging (instructions claires, multilingue).",
    "manual": "Améliorer la notice et le packaging (instructions claires, multilingue).",
    "emballage": "Améliorer le conditionnement pour réduire les avaries (packaging durable).",
    "packaging": "Améliorer le conditionnement pour réduire les avaries (packaging durable).",
    "durée": "Communiquer clairement sur la durée de vie et la garantie.",
    "durability": "Communiquer clairement sur la durée de vie et la garantie.",
    "connectivité": "Fiabiliser la connexion (Bluetooth / WiFi) et la compatibilité.",
    "connection": "Fiabiliser la connexion (Bluetooth / WiFi) et la compatibilité.",
}


def _tokenize(text: str) -> List[str]:
    """Tokenize simple (mots en minuscules, sans ponctuation)."""
    text = re.sub(r"[^\w\s]", " ", text or "").lower()
    return [w for w in text.split() if len(w) > 1 and w not in STOP_WORDS]


def get_recommendations(negative_review_texts: List[str], max_recommendations: int = 5) -> Dict[str, Any]:
    """
    À partir des textes d'avis négatifs :
    - résumé (nombre d'avis, thèmes récurrents)
    - points faibles récurrents (mots clés)
    - liste de recommandations (3 à 5)
    """
    if not negative_review_texts:
        return {
            "summary": "Aucun avis négatif pour ce produit.",
            "weak_points": [],
            "recommendations": [
                "Continuer à collecter des avis pour affiner les recommandations.",
            ],
        }

    all_tokens = []
    for t in negative_review_texts:
        all_tokens.extend(_tokenize(t))
    counter = Counter(all_tokens)
    # Top termes (hors mots trop courts / trop fréquents génériques)
    weak_points = [word for word, _ in counter.most_common(20) if len(word) >= 3][:10]

    # Recommandations : d'abord par mapping thème, puis génériques
    seen = set()
    recommendations = []
    for wp in weak_points:
        key = wp.lower()
        if key in THEME_RECOMMENDATIONS and key not in seen:
            seen.add(key)
            recommendations.append(THEME_RECOMMENDATIONS[key])
    # Compléter avec des recommandations génériques si besoin
    generic = [
        "Mettre en place un suivi post-achat pour identifier rapidement les insatisfactions.",
        "Enrichir la fiche produit avec des réponses aux objections fréquentes.",
        "Proposer un canal de remontée dédié (avis, SAV) pour prioriser les correctifs.",
    ]
    for g in generic:
        if len(recommendations) >= max_recommendations:
            break
        if g not in recommendations:
            recommendations.append(g)

    recommendations = recommendations[:max_recommendations]
    summary = (
        f"Sur {len(negative_review_texts)} avis négatif(s), "
        f"thèmes récurrents : {', '.join(weak_points[:5]) or '—'}."
    )

    return {
        "summary": summary,
        "weak_points": weak_points[:8],
        "recommendations": recommendations,
    }
