import { Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import "./App.css";

function App() {
  return (
    <div className="app">
      <nav className="nav">
        <Link to="/" className="brand">AI Product Advisor</Link>
        <Link to="/">Produits</Link>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
