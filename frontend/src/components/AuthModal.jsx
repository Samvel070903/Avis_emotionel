import { useState } from "react";
import { authApi } from "../api";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ onClose, onSuccess }) {
  const { login } = useAuth();
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await authApi.login(username, password);
      login(data.user, data.token);
      onSuccess?.();
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.register(username, password);
      const { data } = await authApi.login(username, password);
      login(data.user, data.token);
      onSuccess?.();
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || "Inscription impossible (utilisateur déjà existant ?).");
    } finally {
      setLoading(false);
    }
  };

  const submit = tab === "login" ? handleLogin : handleRegister;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="modal auth-modal card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="auth-modal-title" className="card-title" style={{ margin: 0 }}>
            Créer un compte ou se connecter
          </h2>
          <p className="modal-subtitle">
            Connectez-vous pour pouvoir poster un avis (un seul avis par produit).
          </p>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => setTab("login")}
          >
            Connexion
          </button>
          <button
            type="button"
            className={`modal-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => setTab("register")}
          >
            Inscription
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="auth-username">Nom d’utilisateur</label>
            <input
              id="auth-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="auth-password">Mot de passe</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "…" : tab === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
