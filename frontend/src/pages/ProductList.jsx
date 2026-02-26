import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsApi, isAdmin, getAssetUrl } from "../api";
import { useAuth } from "../context/AuthContext";
import ProductForm from "../components/ProductForm";

function ProductImage({ product }) {
  const url = getAssetUrl(product.image_url || product.image);
  if (url) {
    return (
      <img
        src={url}
        alt={product.name}
        className="product-card-image"
      />
    );
  }
  return (
    <div className="product-image-placeholder" aria-hidden>
      <span role="img">📦</span>
    </div>
  );
}

export default function ProductList() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const admin = isAdmin(user);

  const fetchProducts = async () => {
    try {
      setError(null);
      const { data } = await productsApi.list();
      setProducts(data);
    } catch (e) {
      setError(e.response?.data?.error || "Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (payload) => {
    try {
      await productsApi.create(payload);
      setShowForm(false);
      fetchProducts();
    } catch (e) {
      throw new Error(e.response?.data?.error || "Erreur lors de la création.");
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Supprimer ce produit et tous ses avis ?")) return;
    try {
      await productsApi.delete(id);
      fetchProducts();
    } catch (e) {
      alert(e.response?.data?.error || "Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">Catalogue produits</h1>
        <p className="page-subtitle">Chargement…</p>
        <div className="loading-cards">
          {[1, 2, 3].map((i) => (
            <div key={i} className="product-card product-card-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-header">
        <h1 className="page-title">Catalogue produits</h1>
        <div className="card" style={{ maxWidth: 480 }}>
          <p className="error-msg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-header">
      <div className="page-header-top">
        <div>
          <h1 className="page-title">Catalogue produits</h1>
          <p className="page-subtitle">
            Parcourez les produits et consultez les avis analysés par l’IA.
          </p>
        </div>
        {admin && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Annuler" : "+ Ajouter un produit"}
          </button>
        )}
      </div>

      {admin && showForm && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {products.length === 0 ? (
        <div className="card empty-state">
          <p className="empty-state-icon">📋</p>
          <p className="empty-state-title">Aucun produit</p>
          <p className="empty-state-text">
            {admin
              ? "Ajoutez un produit pour commencer à collecter des avis et à afficher les analyses."
              : "Aucun produit pour le moment."}
          </p>
          {admin && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Ajouter un produit
            </button>
          )}
        </div>
      ) : (
        <ul className="product-grid">
          {products.map((p) => (
            <li key={p.id} className="product-card-wrapper">
              <Link to={`/products/${p.id}`} className="product-card">
                <div className="product-card-media">
                  <ProductImage product={p} />
                </div>
                <div className="product-card-body">
                  <h2 className="product-card-title">{p.name}</h2>
                  <span className="product-card-category">{p.category}</span>
                </div>
              </Link>
              {admin && (
                <button
                  type="button"
                  className="btn btn-danger product-card-delete"
                  onClick={(e) => handleDelete(p.id, e)}
                  title="Supprimer le produit"
                >
                  Supprimer
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
