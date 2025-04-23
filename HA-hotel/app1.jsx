import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Form,
  Modal,
  Spinner,
  FormCheck,
} from "react-bootstrap";
import {
  FileEarmarkArrowDown,
  PlusCircle,
  ExclamationTriangle,
  Moon,
  Sun,
  CheckCircle,
} from "react-bootstrap-icons";

export default function StockDashboard() {
  const [stocks, setStocks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [movement, setMovement] = useState({ productId: "", quantity: 0, type: "entry" });
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5001/api/stock");
      setStocks(res.data);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error("Erreur lors de la récupération des stocks :", err);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products"); // Microservice Produits
      const map = {};
      res.data.forEach((product) => {
        map[product.id] =  product.nom || product.name || "Produit inconnu";
      });
      setProductsMap(map);
    } catch (err) {
      console.error("Erreur lors de la récupération des produits :", err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/stock/alerts/list");
      setAlerts(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des alertes :", err);
    }
  };

  const handleMovementSubmit = async () => {
    const endpoint =
      movement.type === "entry"
        ? "http://localhost:5001/api/stock/entry"
        : "http://localhost:5001/api/stock/exit";

    try {
      await axios.post(endpoint, {
        product_id: parseInt(movement.productId),
        quantity: parseInt(movement.quantity),
      });
      setShowModal(false);
      fetchStocks();
      fetchAlerts();
    } catch (err) {
      console.error("Erreur lors de l'envoi du mouvement :", err);
    }
  };

  const exportHistory = () => {
    window.open("http://localhost:5001/api/stock/history/export", "_blank");
  };

  useEffect(() => {
    fetchStocks();
    fetchProducts();
    fetchAlerts();
  }, []);

  const filteredStocks = stocks.filter((s) =>
    s.product_id.toString().includes(search) ||
    productsMap[s.product_id]?.toLowerCase().includes(search.toLowerCase())
  );

  const isLowStock = (productId) => alerts.some((a) => a.product_id === productId);

  return (
    <div className={`container py-5 ${darkMode ? "bg-dark text-light" : ""}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Gestion du Stock</h2>
        <FormCheck
          type="switch"
          id="dark-mode"
          label={darkMode ? <><Sun className="me-1" /> Light Mode</> : <><Moon className="me-1" /> Dark Mode</>}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button variant="success" onClick={() => setShowModal(true)} className="me-2">
            <PlusCircle className="me-2" /> Mouvement Stock
          </Button>
          <Button variant="outline-primary" onClick={exportHistory}>
            <FileEarmarkArrowDown className="me-2" /> Exporter Historique
          </Button>
        </div>
        <Form.Control
          type="text"
          placeholder="🔍 Rechercher par ID ou nom"
          style={{ maxWidth: "300px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {lastUpdated && (
        <div className={`mb-3 small ${darkMode ? "text-secondary" : "text-muted"}`}>
          Dernière mise à jour : {lastUpdated}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="alert alert-warning">
          <ExclamationTriangle className="me-2" />
          Stock faible pour : {alerts.map((a) => a.product_id).join(", ")}
        </div>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant={darkMode ? "light" : "primary"} />
          <div>Chargement des stocks...</div>
        </div>
      ) : (
        <Table bordered hover responsive variant={darkMode ? "dark" : "light"}>
          <thead>
            <tr>
              <th>ID Produit</th>
              <th>Nom du Produit</th>
             
              <th>Quantité Disponible</th>
              <th>Seuil de Stock</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock, index) => {
              const low = isLowStock(stock.product_id);
              return (
                <tr
                  key={index}
                  className={low ? "table-danger" : "table-success"}
                >
                  <td>{stock.product_id}</td>
                  <td>{productsMap[stock.product_id] || "Nom inconnu"}</td>
                  <td>{stock.quantity_available}</td>
                  <td>{stock.stock_threshold}</td>
                  <td>
                    {low ? (
                      <ExclamationTriangle className="text-danger" />
                    ) : (
                      <CheckCircle className="text-success" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* Modal de mouvement */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Mouvement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Produit</Form.Label>
              <Form.Control
                type="text"
                value={movement.productId}
                onChange={(e) => setMovement({ ...movement, productId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantité</Form.Label>
              <Form.Control
                type="number"
                value={movement.quantity}
                onChange={(e) =>
                  setMovement({ ...movement, quantity: parseInt(e.target.value) || 0 })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type de Mouvement</Form.Label>
              <Form.Select
                value={movement.type}
                onChange={(e) => setMovement({ ...movement, type: e.target.value })}
              >
                <option value="entry">Entrée</option>
                <option value="exit">Sortie</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleMovementSubmit}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


//app.jsx sans login :

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Composants chargés de manière paresseuse pour mieux capturer les erreurs
const StockDashboard = React.lazy(() => import('./components/StockDashboard'));
const Mouvement = React.lazy(() => import('./components/Mouvement'));

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (error) => {
      console.error('Error caught:', error);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="alert alert-danger m-4">
        Une erreur est survenue. Veuillez recharger la page.
      </div>
    );
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <div className="container-fluid px-0">
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container">
              <Link to="/" className="navbar-brand">Gestion de Stock</Link>
              <div className="navbar-nav">
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/Mouvement" className="nav-link">Alertes</Link>
              </div>
            </div>
          </nav>

          <main className="container">
            <Suspense fallback={<div className="text-center my-5">Chargement en cours...</div>}>
              <Routes>
                <Route path="/" element={<StockDashboard />} />
                <Route path="/Mouvement" element={<Mouvement />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
// APP AVEC LOGIN

import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiBarChart2, FiBell, FiLogOut, FiMenu } from 'react-icons/fi';

// Composants chargés de manière paresseuse
const StockDashboard = React.lazy(() => import('./components/StockDashboard'));
const Mouvement = React.lazy(() => import('./components/Mouvement'));
const Login = React.lazy(() => import('./components/Login'));

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (error) => {
      console.error('Error caught:', error);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return <div className="alert alert-danger m-4">Une erreur est survenue.</div>;
  }

  return children;
};

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Layout = ({ children, handleLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className={`col-md-3 col-lg-2 d-md-block bg-dark sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
             style={{ minHeight: '100vh', transition: 'all 0.3s' }}>
          <div className="position-sticky pt-3">
            <div className="d-flex justify-content-between align-items-center px-3 mb-4">
              {!sidebarCollapsed && <span className="fs-4 text-white">H-Stock</span>}
              <button 
                className="btn btn-link text-white"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <FiMenu size={20} />
              </button>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/" className="nav-link text-white d-flex align-items-center">
                  <FiBarChart2 className="me-2" />
                  {!sidebarCollapsed && <span>Dashboard</span>}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Mouvement" className="nav-link text-white d-flex align-items-center">
                  <FiBell className="me-2" />
                  {!sidebarCollapsed && <span>Alertes</span>}
                </Link>
              </li>
              <li className="nav-item mt-4">
                <button 
                  onClick={handleLogout} 
                  className="btn btn-link nav-link text-white d-flex align-items-center"
                >
                  <FiLogOut className="me-2" />
                  {!sidebarCollapsed && <span>Déconnexion</span>}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <main className={`col-md-9 ms-sm-auto col-lg-10 px-md-4 ${sidebarCollapsed ? 'col-md-12' : ''}`}>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <button 
              className="btn btn-outline-secondary d-md-none me-2" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <FiMenu />
            </button>
            <h1 className="h2">H-Stock</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div className="text-center my-5">Chargement en cours...</div>}>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/*" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout handleLogout={handleLogout}>
                  <Routes>
                    <Route path="/" element={<StockDashboard />} />
                    <Route path="/Mouvement" element={<Mouvement />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;