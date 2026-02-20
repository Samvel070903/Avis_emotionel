import { Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import "./App.css";

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav className="nav">
      <Link to="/" className="brand">
        Avis Émotionnel <span className="brand-sub">— Conseiller Produits IA</span>
      </Link>
      <Link to="/">Catalogue</Link>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-user">
              Connecté : <strong>{user.username}</strong>
            </span>
            <button type="button" className="btn btn-soft" onClick={logout}>
              Déconnexion
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Nav />
        <main className="main">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
