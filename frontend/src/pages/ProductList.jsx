import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../api";
import ProductForm from "../components/ProductForm";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
    if (!window.confirm("Supprimer ce produit et tous ses avis ?")) return;
    try {
      await productsApi.delete(id);
      fetchProducts();
    } catch (e) {
      alert(e.response?.data?.error || "Erreur lors de la suppression.");
    }
  };

  if (loading) return <p className="card">Chargement…</p>;
  if (error) return <p className="card error-msg">{error}</p>;

  return (
    <>
      <h1 className="page-title">Produits</h1>
      <div className="card">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Annuler" : "+ Ajouter un produit"}
        </button>
        {showForm && (
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {products.length === 0 ? (
          <li className="card">Aucun produit. Ajoutez-en un pour commencer.</li>
        ) : (
          products.map((p) => (
            <li key={p.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <Link to={`/products/${p.id}`} style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                  {p.name}
                </Link>
                <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>
                  {p.category}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-danger"
                onClick={(e) => handleDelete(p.id, e)}
              >
                Supprimer
              </button>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
