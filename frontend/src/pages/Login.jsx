import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await authApi.login(username, password);
      login(data.user, data.token);
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.error || "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-header">
          <h1 className="page-title" style={{ marginBottom: "0.25rem" }}>Connexion</h1>
          <p className="page-subtitle" style={{ marginBottom: "1.5rem" }}>
            Accédez à l’administration des produits et des scores.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nom d’utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex. admin"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
          <p className="login-hint">
            Pour l’administration, connectez-vous avec le compte <strong>admin</strong>.
          </p>
        </form>
      </div>
    </div>
  );
}
