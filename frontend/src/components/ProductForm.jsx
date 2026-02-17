import { useState } from "react";

export default function ProductForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }
    if (!category.trim()) {
      setError("La catégorie est obligatoire.");
      return;
    }
    try {
      await onSubmit({ name: name.trim(), category: category.trim() });
      setName("");
      setCategory("");
    } catch (e) {
      setError(e.message || "Erreur.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem", maxWidth: "400px" }}>
      <div className="form-group">
        <label>Nom du produit</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex. Casque Bluetooth X1"
        />
      </div>
      <div className="form-group">
        <label>Catégorie</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Ex. Audio, Sport, Maison"
        />
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <button type="submit" className="btn btn-primary">Créer</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
