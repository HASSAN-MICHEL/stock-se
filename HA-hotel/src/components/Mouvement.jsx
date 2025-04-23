import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Form,
  Modal,
  Spinner,
  Badge,
  Alert,
  Card
} from "react-bootstrap";
import {
  FiDownload,
  FiPlusCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiSearch,
  FiRefreshCw,
  FiBox
} from "react-icons/fi";

export default function Mouvement() {
  const [stocks, setStocks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [movement, setMovement] = useState({ productId: "", quantity: 0, type: "entry" });
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStocks = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/stock");
      setStocks(res.data);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error("Erreur lors de la récupération des stocks :", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const map = {};
      res.data.forEach((product) => {
        map[product.id] = product.nom || product.name || "Produit inconnu";
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
      refreshData();
    } catch (err) {
      console.error("Erreur lors de l'envoi du mouvement :", err);
    }
  };

  const exportHistory = () => {
    window.open("http://localhost:5001/api/stock/history/export", "_blank");
  };

  const refreshData = () => {
    setIsRefreshing(true);
    Promise.all([fetchStocks(), fetchProducts(), fetchAlerts()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredStocks = stocks.filter((s) =>
    s.product_id.toString().includes(search) ||
    productsMap[s.product_id]?.toLowerCase().includes(search.toLowerCase())
  );

  const isLowStock = (productId) => alerts.some((a) => a.product_id === productId);

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">
          <FiBox className="me-2" />
          Gestion des Mouvements de Stock
        </h2>
        <Button 
          variant="outline-primary" 
          onClick={refreshData}
          disabled={isRefreshing}
        >
          <FiRefreshCw className={`me-2 ${isRefreshing ? "spin" : ""}`} />
          {isRefreshing ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex flex-wrap gap-2">
              <Button 
                variant="primary" 
                onClick={() => setShowModal(true)}
                className="d-flex align-items-center"
              >
                <FiPlusCircle className="me-2" />
                Nouveau Mouvement
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={exportHistory}
                className="d-flex align-items-center"
              >
                <FiDownload className="me-2" />
                Exporter Historique
              </Button>
            </div>
            
            <div style={{ maxWidth: "300px" }}>
              <Form.Group className="mb-0">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FiSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher par ID ou nom"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </Form.Group>
            </div>
          </div>
        </Card.Body>
      </Card>

      {lastUpdated && (
        <div className="text-muted mb-3 small">
          Dernière mise à jour : {lastUpdated}
        </div>
      )}

      {alerts.length > 0 && (
        <Alert variant="warning" className="d-flex align-items-center">
          <FiAlertTriangle className="me-2 flex-shrink-0" size={20} />
          <div>
            <strong>Stock faible détecté</strong> pour les produits :{" "}
            {alerts.map((a, index) => (
              <span key={a.product_id}>
                <Badge bg="warning" text="dark" className="me-1">
                  {a.product_id} - {productsMap[a.product_id] || "Nom inconnu"}
                </Badge>
                {index < alerts.length - 1 && ", "}
              </span>
            ))}
          </div>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Chargement des données de stock...</div>
        </div>
      ) : (
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="bg-primary text-white">
              <tr>
                <th>ID Produit</th>
                <th>Nom du Produit</th>
                <th className="text-end">Quantité</th>
                <th className="text-end">Seuil</th>
                <th className="text-center">État</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => {
                const isLow = isLowStock(stock.product_id);
                return (
                  <tr key={stock.product_id} className={isLow ? "table-warning" : ""}>
                    <td>{stock.product_id}</td>
                    <td>{productsMap[stock.product_id] || "Nom inconnu"}</td>
                    <td className="text-end">{stock.quantity_available}</td>
                    <td className="text-end">{stock.stock_threshold}</td>
                    <td className="text-center">
                      {isLow ? (
                        <FiAlertTriangle className="text-warning" />
                      ) : (
                        <FiCheckCircle className="text-success" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal de mouvement */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Nouveau Mouvement de Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Produit</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez l'ID du produit"
                value={movement.productId}
                onChange={(e) => setMovement({ ...movement, productId: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Quantité</Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="Quantité"
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
                <option value="entry">Entrée de stock</option>
                <option value="exit">Sortie de stock</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleMovementSubmit}>
            Enregistrer le mouvement
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}