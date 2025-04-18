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
        ? `http://localhost:5001/api/stock/entry`
        : `http://localhost:5001/api/stock/exit`;

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
    fetchAlerts();
  }, []);

  const filteredStocks = stocks.filter((s) =>
    s.product_id.toString().includes(search)
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
          placeholder="🔍 Rechercher par ID Produit"
          style={{ maxWidth: "250px" }}
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
              <th>Produit ID</th>
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
