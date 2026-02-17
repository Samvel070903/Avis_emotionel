# AI Product Advisor

Application web qui centralise les avis clients, analyse automatiquement le sentiment (IA) et propose des recommandations d’amélioration à partir des retours négatifs.

## Stack

- **Frontend** : React (Vite), CSS, Axios, Chart.js, React Router
- **Backend** : Python, Flask, Flask-CORS, SQLAlchemy
- **Base de données** : SQLite
- **IA** : Hugging Face Transformers (analyse de sentiment, modèle `cardiffnlp/twitter-roberta-base-sentiment-latest`)

## Prérequis

- Python 3.10+
- Node.js 18+
- npm ou yarn

## Installation et lancement

### 1. Backend (API Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows : venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

L’API tourne sur **http://localhost:5000**.  
Au premier avis ajouté, le modèle de sentiment est téléchargé (quelques centaines de Mo) ; le premier appel peut prendre 30 à 60 secondes.

### 2. Frontend (React)

Dans un autre terminal :

```bash
cd frontend
npm install
npm run dev
```

L’application est disponible sur **http://localhost:5173** (ou le port indiqué par Vite).

### Variable d’environnement (optionnel)

Pour pointer le frontend vers une autre URL d’API :

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

## API REST (endpoints principaux)

| Méthode | URL | Description |
|--------|-----|-------------|
| GET | `/api/products` | Liste des produits |
| POST | `/api/products` | Créer un produit (body: `name`, `category`) |
| GET | `/api/products/:id` | Détail d’un produit |
| PUT | `/api/products/:id` | Modifier un produit |
| DELETE | `/api/products/:id` | Supprimer un produit |
| GET | `/api/products/:id/reviews` | Liste des avis du produit |
| POST | `/api/products/:id/reviews` | Ajouter un avis (body: `text`, `rating` 1–5) — sentiment IA calculé automatiquement |
| GET | `/api/products/:id/stats` | Statistiques (nb avis, répartition sentiment, moyenne notes) |
| GET | `/api/products/:id/recommendations` | Recommandations basées sur les avis négatifs |

## Fonctionnalités

- **Produits** : liste, création, suppression, modification (optionnel)
- **Avis** : ajout (texte + note 1–5), liste ; sentiment (positif / neutre / négatif) et score de confiance calculés automatiquement par l’IA
- **Statistiques** : nombre d’avis, répartition des sentiments, moyenne des notes, graphiques (camembert + barres)
- **Recommandations** : résumé des retours négatifs, points faibles récurrents, 3 à 5 actions recommandées (règles + mots clés sur avis négatifs)

## Structure du projet

```
Projet/
├── backend/
│   ├── app.py              # Point d’entrée Flask
│   ├── config.py           # Configuration
│   ├── extensions.py       # SQLAlchemy
│   ├── models/             # Product, Review
│   ├── routes/             # API (products, reviews, stats)
│   ├── services/           # Sentiment IA, recommandations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api.js          # Client Axios
│   │   ├── pages/          # ProductList, ProductDetail
│   │   ├── components/     # ProductForm, ReviewForm, ReviewList, StatsChart, Recommendations
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Base de données (SQLite)

- **products** : `id`, `name`, `category`, `created_at`
- **reviews** : `id`, `product_id`, `text`, `rating`, `sentiment`, `sentiment_score`, `created_at`

Fichier créé automatiquement : `backend/ai_product_advisor.db`.
