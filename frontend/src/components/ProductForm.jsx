import { useState, useRef } from "react";

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";

function getPreviewFile(file) {
  if (!file || !file.type.startsWith("image/")) return null;
  return file;
}

export default function ProductForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const setFile = (file) => {
    if (imageFile && preview) URL.revokeObjectURL(preview);
    if (!file) {
      setImageFile(null);
      setPreview(null);
      return;
    }
    const f = getPreviewFile(file);
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
    e.target.value = "";
  };

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
      if (imageFile) {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("category", category.trim());
        formData.append("image", imageFile);
        await onSubmit(formData);
      } else {
        await onSubmit({ name: name.trim(), category: category.trim() });
      }
      setName("");
      setCategory("");
      setFile(null);
    } catch (err) {
      setError(err.message || "Erreur.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <h2 className="card-title">Nouveau produit</h2>
        <label>Image du produit</label>
        <div
          className={`dropzone ${dragOver ? "dropzone-active" : ""} ${preview ? "dropzone-has-preview" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            onChange={handleFileChange}
            className="dropzone-input"
            aria-label="Choisir une image"
          />
          {preview ? (
            <div className="dropzone-preview">
              <img src={preview} alt="Aperçu" />
              <span className="dropzone-preview-label">Cliquer ou glisser une autre image</span>
              <button
                type="button"
                className="dropzone-remove"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                aria-label="Retirer l’image"
              >
                ×
              </button>
            </div>
          ) : (
            <span className="dropzone-placeholder">
              Glisser-déposer une image ici ou cliquer pour choisir
            </span>
          )}
        </div>
        <p className="form-hint">JPG, PNG, GIF ou WebP</p>
      </div>
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
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Créer le produit</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
