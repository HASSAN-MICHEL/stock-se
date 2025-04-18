import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

axios.defaults.baseURL = "http://localhost:3000";

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [show, setShow] = useState(false); // Afficher la modale pour ajouter/modifier un menu
  const [orderShow, setOrderShow] = useState(false); // Afficher la modale pour passer une commande
  const [formData, setFormData] = useState({ nom: "", categorie: "repas", prix: "" });
  const [orderData, setOrderData] = useState({ quantite: 1, type_commande: "restaurant", client_id: 1 }); // Données pour la commande
  const [editId, setEditId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null); // Menu sélectionné pour la commande

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const menusPerPage = 9;

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get("/api/restaurant/menu");
      setMenus(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des menus", error.response || error.message);
      alert("Erreur lors du chargement des menus");
    }
  };

  const handleShow = (menu = null) => {
    if (menu) {
      setFormData(menu);
      setEditId(menu.id);
    } else {
      setFormData({ nom: "", categorie: "repas", prix: "" });
      setEditId(null);
    }
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.nom || !formData.categorie || !formData.prix) {
      alert("Tous les champs sont requis !");
      return;
    }

    try {
      if (editId) {
        await axios.put(`/api/restaurant/menu/${editId}`, formData);
        alert("Menu modifié avec succès !");
      } else {
        await axios.post("/api/restaurant/menu", formData);
        alert("Menu ajouté avec succès !");
      }
      fetchMenus();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification du menu", error.response || error.message);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/restaurant/menu/${id}`);
      alert("Menu supprimé avec succès !");
      fetchMenus();
    } catch (error) {
      console.error("Erreur lors de la suppression du menu", error.response || error.message);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const handleOrder = (menu) => {
    setSelectedMenu(menu);
    setOrderData({ quantite: 1, type_commande: "restaurant", client_id: 1 }); // Remplacer 1 par l'ID du client actuel
    setOrderShow(true); // Ouvrir la modale pour passer la commande
  };

  const handleOrderClose = () => setOrderShow(false);

  const handleOrderChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  // Calcul du montant total
  const calculateTotal = () => {
    if (selectedMenu) {
      return selectedMenu.prix * orderData.quantite;
    }
    return 0;
  };

  const handleSubmitOrder = async () => {
    if (!orderData.quantite || !orderData.type_commande || !selectedMenu || !orderData.client_id) {
      alert("Tous les champs sont requis !");
      return;
    }
    const orderDataToSend = {
      menu_id: selectedMenu.id,
      client_id: orderData.client_id, // Utilisation du client_id dans les données de la commande
      montant_total: calculateTotal(), // Calculer le montant total
      quantite: orderData.quantite,
      type_commande: orderData.type_commande,
    };

    try {
      const response = await axios.post("/api/restaurant/order", orderDataToSend);
      console.log("Réponse du serveur :", response.data);
      alert("Commande passée avec succès !");
      handleOrderClose();
    } catch (error) {
      console.error("Erreur lors de la commande", error.response?.data || error.message);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  // Gestion de la pagination
  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h2>Gestion du Restaurant</h2>
      <Button variant="primary" onClick={() => handleShow()} className="mb-3">
        Ajouter un menu
      </Button>

      {menus.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMenus.map((menu) => (
                <tr key={menu.id}>
                  <td>{menu.id}</td>
                  <td>{menu.nom}</td>
                  <td>{menu.categorie}</td>
                  <td>{menu.prix} €</td>
                  <td>
                    <Button variant="warning" onClick={() => handleShow(menu)} className="me-2">
                      Modifier
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(menu.id)} className="me-2">
                      Supprimer
                    </Button>
                    <Button variant="success" onClick={() => handleOrder(menu)}>
                      Commander
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <Button
              variant="secondary"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <span className="mx-3">Page {currentPage}</span>
            <Button
              variant="secondary"
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastMenu >= menus.length}
            >
              Suivant
            </Button>
          </div>
        </>
      ) : (
        <p>Aucun menu disponible</p>
      )}

      {/* Modal pour l'ajout/modification */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Modifier" : "Ajouter"} un menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" name="nom" value={formData.nom} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Catégorie</Form.Label>
              <Form.Select name="categorie" value={formData.categorie} onChange={handleChange}>
                <option value="repas">Repas</option>
                <option value="boisson">Boisson</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Prix</Form.Label>
              <Form.Control type="number" name="prix" value={formData.prix} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal pour passer une commande */}
      <Modal show={orderShow} onHide={handleOrderClose}>
        <Modal.Header closeButton>
          <Modal.Title>Passer une commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Menu</Form.Label>
              <Form.Control type="text" value={selectedMenu ? selectedMenu.nom : ''} readOnly />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quantité</Form.Label>
              <Form.Control
                type="number"
                name="quantite"
                min="1"
                value={orderData.quantite}
                onChange={handleOrderChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Type de commande</Form.Label>
              <Form.Control
                as="select"
                name="type_commande"
                value={orderData.type_commande}
                onChange={handleOrderChange}
              >
                <option value="restaurant">Restaurant</option>
                <option value="bar">Bar</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Prix unitaire</Form.Label>
              <Form.Control
                type="text"
                value={selectedMenu ? `${selectedMenu.prix} €` : ''}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Montant total</Form.Label>
              <Form.Control
                type="text"
                value={`${calculateTotal()} €`}
                readOnly
              />
            </Form.Group>
            {/* Champ client_id */}
            <Form.Group>
              <Form.Label>Client ID</Form.Label>
              <Form.Control
                type="text"
                name="client_id"
                value={orderData.client_id}
                onChange={handleOrderChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOrderClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmitOrder}>
            Passer la commande
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Menus;
