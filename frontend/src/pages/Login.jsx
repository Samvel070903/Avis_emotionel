import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";

export default function Login({ onLogin }) {
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
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (onLogin) {
        onLogin(data.user);
      }
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.error || "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1 className="page-title" style={{ textAlign: "center" }}>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        {error && <p className="error-msg" style={{ marginTop: "0.5rem" }}>{error}</p>}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ marginTop: "1rem", width: "100%" }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Pour l'administration des scores, connectez-vous en tant qu'<strong>admin</strong>.
        </p>
      </form>
    </div>
  );
}
