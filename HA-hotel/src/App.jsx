import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StockDashboard from './components/StockDashboard';
import StockAlerts from './components/StockAlerts';

const App = () => {
  return (
    <Router>
      <div className="container mt-4">
        <nav className="mb-3">
          <Link to="/" className="btn btn-primary me-2">Dashboard Stock</Link>
          <Link to="/alertes" className="btn btn-danger">Alertes</Link>
        </nav>
        <Routes>
          <Route path="/" element={<StockDashboard />} />
          <Route path="/alertes" element={<StockAlerts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
