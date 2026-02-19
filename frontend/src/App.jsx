import { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAdmin = user && user.username === "admin";

  return (
    <div className="app">
      <nav className="nav">
        <Link to="/" className="brand">AI Product Advisor</Link>
        <Link to="/">Produits</Link>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {user ? (
            <>
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Connecté en tant que <strong>{user.username}</strong>
              </span>
              <button type="button" className="btn" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login">Connexion</Link>
          )}
        </div>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<ProductList isAdmin={isAdmin} />} />
          <Route
            path="/products/:productId"
            element={isAdmin ? <ProductDetail /> : <Navigate to="/" replace />}
          />
          <Route path="/login" element={<Login onLogin={setUser} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
