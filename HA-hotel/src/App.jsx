import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, AuthContext } from './settingApp/AuthProvider';
import { 
  FiBarChart2, 
  FiBell, 
  FiLogOut, 
  FiMenu, 
  FiHome,
  FiTrendingUp,
  FiClock,
  FiSettings,
  FiPackage,
  FiAlertCircle
} from 'react-icons/fi';

// Composants chargés de manière paresseuse
const StockDashboard = React.lazy(() => import('./components/StockDashboard'));
const Mouvement = React.lazy(() => import('./components/Mouvement'));
const Login = React.lazy(() => import('./components/Login'));
const StockUpdate = React.lazy(() => import('./components/StockUpdate'));
const Settings = React.lazy(() => import('./components/Settings'));

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
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className="container-fluid px-0">
      <div className="row g-0">
        {/* Sidebar */}
        <div 
          className={`sidebar bg-primary ${sidebarCollapsed ? 'collapsed' : ''}`}
          style={{
            minHeight: '100vh',
            width: sidebarCollapsed ? '80px' : '250px',
            transition: 'all 0.3s ease',
            position: 'fixed',
            zIndex: 1000
          }}
        >
          <div className="d-flex flex-column h-100 p-3 text-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
              {!sidebarCollapsed && (
                <span className="fs-4 fw-bold">
                  <FiPackage className="me-2" />
                  H-Stock
                </span>
              )}
              <button 
                className="btn btn-link text-white p-0"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <FiMenu size={24} />
              </button>
            </div>
            
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item mb-2">
                <Link 
                  to="/" 
                  className={`nav-link text-white d-flex align-items-center ${activeItem === 'dashboard' ? 'active bg-white text-primary' : ''}`}
                  onClick={() => setActiveItem('dashboard')}
                >
                  <FiHome className="me-3" size={18} />
                  {!sidebarCollapsed && <span>Tableau de bord</span>}
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link 
                  to="/Mouvement" 
                  className={`nav-link text-white d-flex align-items-center ${activeItem === 'mouvement' ? 'active bg-white text-primary' : ''}`}
                  onClick={() => setActiveItem('mouvement')}
                >
                  <FiTrendingUp className="me-3" size={18} />
                  {!sidebarCollapsed && <span>Mouvements</span>}
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link 
                  to="/StockUpdate" 
                  className={`nav-link text-white d-flex align-items-center ${activeItem === 'history' ? 'active bg-white text-primary' : ''}`}
                  onClick={() => setActiveItem('history')}
                >
                  <FiClock className="me-3" size={18} />
                  {!sidebarCollapsed && <span>Historique</span>}
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link 
                  to="/Settings" 
                  className={`nav-link text-white d-flex align-items-center ${activeItem === 'settings' ? 'active bg-white text-primary' : ''}`}
                  onClick={() => setActiveItem('settings')}
                >
                  <FiSettings className="me-3" size={18} />
                  {!sidebarCollapsed && <span>Paramètres</span>}
                </Link>
              </li>
            </ul>
            
            <div className="mt-auto">
              <button 
                onClick={handleLogout} 
                className="btn btn-light w-100 d-flex align-items-center justify-content-center"
              >
                <FiLogOut className="me-2" />
                {!sidebarCollapsed && <span>Déconnexion</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main 
          className="main-content"
          style={{
            marginLeft: sidebarCollapsed ? '80px' : '250px',
            transition: 'margin 0.3s ease',
            minHeight: '100vh',
            width: sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 250px)'
          }}
        >
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 px-4 border-bottom">
            <button 
              className="btn btn-outline-primary d-md-none me-2" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <FiMenu />
            </button>
            <h1 className="h2 text-primary">
              {activeItem === 'dashboard' && 'Tableau de bord'}
              {activeItem === 'mouvement' && 'Mouvements de stock'}
              {activeItem === 'history' && 'Historique des stocks'}
              {activeItem === 'settings' && 'Paramètres'}
            </h1>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <FiBell size={20} className="text-primary" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </div>
              <div className="dropdown">
                <button 
                  className="btn btn-light dropdown-toggle d-flex align-items-center" 
                  type="button" 
                  id="dropdownMenuButton" 
                  data-bs-toggle="dropdown"
                >
                  <div className="me-2 d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{width: '30px', height: '30px'}}>
                    U
                  </div>
                  {!sidebarCollapsed && <span>Utilisateur</span>}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#">Profil</a></li>
                  <li><a className="dropdown-item" href="#">Paramètres</a></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3">
            {children}
          </div>
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
        <Suspense fallback={
          <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/*" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout handleLogout={handleLogout}>
                  <Routes>
                    <Route path="/" element={<StockDashboard />} />
                    <Route path="/Mouvement" element={<Mouvement />} />
                    <Route path="/StockUpdate" element={<StockUpdate />} />
                    <Route path="/Settings" element={<Settings />} />
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