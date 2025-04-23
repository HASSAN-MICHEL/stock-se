import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Spinner, Alert, Button, Tab, Tabs } from 'react-bootstrap';
import { 
  FiAlertTriangle, FiPackage, FiTrendingUp, FiTrendingDown, 
  FiClock, FiAlertCircle, FiDatabase, FiList, FiArchive 
} from 'react-icons/fi';
import axios from 'axios';

export default function StockUpdate() {
  const [dashboardData, setDashboardData] = useState({
    alerts: [],
    totalStock: 0,
    todayEntries: 0,
    todayExits: 0,
    recentActivities: [],
    currentStock: [],
    productHistory: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all necessary data
        const [alertsRes, statsRes, historyRes, stockRes] = await Promise.all([
          axios.get('http://localhost:5001/api/stock/alerts/list'),
          axios.get('http://localhost:5001/api/stock/stats/basic'),
          axios.get('http://localhost:5001/api/stock/history/export'),
          axios.get('http://localhost:5001/api/stock/')
        ]);

        // Process data
        let historyData = historyRes.data;
        if (typeof historyData === 'string') {
          historyData = historyData.split('\n')
            .slice(1)
            .map(row => {
              const [product_id, action, quantity, date] = row.split(',');
              return { product_id, action, quantity: parseInt(quantity), date };
            });
        }

        const today = new Date().toISOString().split('T')[0];
        const todayData = historyData.filter(item => item.date.includes(today));
        
        setDashboardData({
          alerts: alertsRes.data,
          totalStock: statsRes.data.balance,
          todayEntries: todayData.filter(i => i.action === 'entry').reduce((s, i) => s + i.quantity, 0),
          todayExits: todayData.filter(i => i.action === 'exit').reduce((s, i) => s + i.quantity, 0),
          recentActivities: [...historyData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
          currentStock: stockRes.data,
          productHistory: null
        });

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchProductHistory = async (productId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5001/api/stock/history/full/${productId}`);
      setDashboardData(prev => ({
        ...prev,
        productHistory: {
          productId,
          history: res.data
        }
      }));
      setActiveTab('history');
    } catch (err) {
      console.error('Fetch history error:', err);
      setError("Erreur lors du chargement de l'historique");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Chargement en cours...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        <FiAlertTriangle className="me-2" />
        {error}
        <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </Alert>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">
        <FiPackage className="me-2" />
        Tableau de bord du stock
      </h1>

      {/* Summary Cards - Identique à la version précédente */}
      <Row className="g-4 mb-4">
        {/* ... (Vos cartes indicateurs existantes) ... */}
      </Row>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="current" title={
          <span><FiList className="me-1" /> Stock actuel</span>
        }>
          <Card className="shadow-sm mt-3">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <FiDatabase className="me-2" />
                État du stock
              </h5>
            </Card.Header>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Stock actuel</th>
                    <th>Seuil d'alerte</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.currentStock.map((product) => (
                    <tr key={product.product_id}>
                      <td>
                        {product.product_name || `Produit #${product.product_id}`}
                      </td>
                      <td>{product.quantity_available}</td>
                      <td>{product.stock_threshold}</td>
                      <td>
                        <Badge bg={product.quantity_available < product.stock_threshold ? 'danger' : 'success'}>
                          {product.quantity_available < product.stock_threshold ? 'Alerte' : 'OK'}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product.product_id);
                            fetchProductHistory(product.product_id);
                          }}
                        >
                          Voir historique
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="history" title={
          <span><FiArchive className="me-1" /> Historique</span>
        } disabled={!dashboardData.productHistory}>
          {dashboardData.productHistory && (
            <Card className="shadow-sm mt-3">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FiClock className="me-2" />
                  Historique pour produit #{dashboardData.productHistory.productId}
                </h5>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setActiveTab('current')}
                >
                  Retour au stock
                </Button>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Quantité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.productHistory.history.map((item, index) => (
                      <tr key={index}>
                        <td>{new Date(item.date).toLocaleString()}</td>
                        <td>
                          <Badge bg={item.action === 'entry' ? 'success' : 'warning'}>
                            {item.action === 'entry' ? 'Entrée' : 'Sortie'}
                          </Badge>
                        </td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Tab>

        <Tab eventKey="recent" title={
          <span><FiClock className="me-1" /> Activité récente</span>
        }>
          {/* ... (Votre tableau d'activité récente existant) ... */}
        </Tab>
      </Tabs>
    </div>
  );
}