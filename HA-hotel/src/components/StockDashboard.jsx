import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { 
  FiAlertTriangle, FiPackage, FiTrendingUp, FiTrendingDown, 
  FiClock, FiAlertCircle, FiDatabase 
} from 'react-icons/fi';
import axios from 'axios';

export default function StockDashboard() {
  const [dashboardData, setDashboardData] = useState({
    alerts: [],
    totalStock: 0,
    todayEntries: 0,
    todayExits: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Fetch alerts
        const alertsRes = await axios.get('http://localhost:5001/api/stock/alerts/list');
        
        // 2. Fetch basic stats
        const statsRes = await axios.get('http://localhost:5001/api/stock/stats/basic');
        
        // 3. Fetch recent activities from history (using existing export route)
        const historyRes = await axios.get('http://localhost:5001/api/stock/history/export');
        
        // Convert CSV string to JSON if needed
        let historyData = historyRes.data;
        if (typeof historyData === 'string') {
          historyData = historyData.split('\n')
            .slice(1) // skip header
            .map(row => {
              const [product_id, action, quantity, date] = row.split(',');
              return { product_id, action, quantity: parseInt(quantity), date };
            });
        }

        // Process data for today
        const today = new Date().toISOString().split('T')[0];
        const todayData = historyData.filter(item => item.date.includes(today));
        
        const todayEntries = todayData
          .filter(item => item.action === 'entry')
          .reduce((sum, item) => sum + item.quantity, 0);
          
        const todayExits = todayData
          .filter(item => item.action === 'exit')
          .reduce((sum, item) => sum + item.quantity, 0);

        // Get 4 most recent activities
        const recentActivities = [...historyData]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4);

        setDashboardData({
          alerts: alertsRes.data,
          totalStock: statsRes.data.balance,
          todayEntries,
          todayExits,
          recentActivities
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
        <div className="mt-2">
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-sm btn-outline-danger"
          >
            Réessayer
          </button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">
        <FiPackage className="me-2" />
        Tableau de bord du stock
      </h1>

      {/* Summary Cards */}
      <Row className="g-4 mb-4">
        {/* Alerts Card */}
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <FiAlertTriangle size={32} className="text-danger me-3" />
              <div>
                <h6 className="text-muted mb-1">Alertes</h6>
                <h3 className="mb-0">{dashboardData.alerts.length}</h3>
                <small className="text-muted">Stock critique</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Stock Card */}
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <FiDatabase size={32} className="text-primary me-3" />
              <div>
                <h6 className="text-muted mb-1">Stock total</h6>
                <h3 className="mb-0">{dashboardData.totalStock}</h3>
                <small className="text-muted">Unités disponibles</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Today's Entries Card */}
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <FiTrendingUp size={32} className="text-success me-3" />
              <div>
                <h6 className="text-muted mb-1">Entrées</h6>
                <h3 className="mb-0">{dashboardData.todayEntries}</h3>
                <small className="text-muted">Aujourd'hui</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Today's Exits Card */}
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <FiTrendingDown size={32} className="text-warning me-3" />
              <div>
                <h6 className="text-muted mb-1">Sorties</h6>
                <h3 className="mb-0">{dashboardData.todayExits}</h3>
                <small className="text-muted">Aujourd'hui</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity and Alerts */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <FiClock className="me-2" />
                Activité récente
              </h5>
            </Card.Header>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Type</th>
                    <th>Quantité</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentActivities.map((activity, index) => (
                    <tr key={index}>
                      <td>#{activity.product_id}</td>
                      <td>
                        <Badge bg={activity.action === 'entry' ? 'success' : 'warning'}>
                          {activity.action === 'entry' ? 'Entrée' : 'Sortie'}
                        </Badge>
                      </td>
                      <td>{activity.quantity}</td>
                      <td>{new Date(activity.date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <FiAlertCircle className="me-2" />
                Alertes de stock
              </h5>
            </Card.Header>
            <Card.Body>
              {dashboardData.alerts.length > 0 ? (
                <>
                  <Alert variant="warning" className="d-flex align-items-center">
                    <FiAlertTriangle className="me-2" />
                    {dashboardData.alerts.length} produit(s) en alerte
                  </Alert>
                  <Table size="sm">
                    <tbody>
                      {dashboardData.alerts.slice(0, 3).map((alert, index) => (
                        <tr key={index}>
                          <td>#{alert.product_id}</td>
                          <td>{alert.quantity_available} unités</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <Alert variant="success" className="d-flex align-items-center">
                  <FiPackage className="me-2" />
                  Aucune alerte de stock
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}