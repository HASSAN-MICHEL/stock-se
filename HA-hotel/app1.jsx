import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPowerOff } from 'react-icons/fa'; // Icône de bouton d'allumage

function App() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    category: 'Bière',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('white'); // Etat pour changer la couleur de fond

  // Récupérer tous les produits
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/produits');
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  };

  // Ajouter ou modifier un produit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await axios.put(
          `http://localhost:5000/api/produits/${product.id}`,
          product
        );
        setAlertMessage('Produit modifié avec succès!');
      } else {
        const response = await axios.post('http://localhost:5000/api/produits', product);
        setAlertMessage('Produit ajouté avec succès!');
      }
      setProduct({
        id: '',
        name: '',
        price: '',
        description: '',
        category: 'Bière',
      });
      setIsEditing(false);
      setShowModal(true);
      fetchProducts();
    } catch (error) {
      console.error('Erreur lors de l\'ajout ou de la modification du produit:', error);
      setAlertMessage('Erreur lors de l\'ajout ou de la modification du produit');
      setShowModal(true);
    }
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Modifier un produit
  const handleEdit = (prod) => {
    setProduct(prod);
    setIsEditing(true);
  };

  // Supprimer un produit
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/produits/${id}`);
      setAlertMessage('Produit supprimé avec succès!');
      setShowModal(true);
      fetchProducts();
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      setAlertMessage('Erreur lors de la suppression du produit');
      setShowModal(true);
    }
  };

  // Charger les produits lors du premier rendu
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fonction pour changer le fond de l'application
  const toggleBackgroundColor = () => {
    setBackgroundColor(backgroundColor === 'white' ? 'black' : 'white');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: backgroundColor,
        color: backgroundColor === 'white' ? 'black' : 'white',
        paddingTop: '20px',
      }}
    >
      {/* Bouton circulaire pour changer la couleur de fond */}
      <button
        onClick={toggleBackgroundColor}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          backgroundColor: '#f1f1f1',
          border: 'none',
          borderRadius: '50%',
          padding: '10px',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <FaPowerOff />
      </button>

      <div className="container mt-5">
        <h1 className="text-center mb-5">{isEditing ? 'Modifier un produit' : 'Ajouter un produit'}</h1>

        {/* Formulaire d'ajout ou modification de produit */}
        <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nom du produit</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Prix</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Description du produit"
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Catégorie</label>
            <select
              className="form-select"
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
            >
              <option value="Bière">Bière</option>
              <option value="Jus">Jus</option>
              <option value="Canette">Canette</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success btn-lg w-100">
            {isEditing ? 'Mettre à jour' : 'Ajouter le produit'}
          </button>
        </form>

        {/* Modal d'alerte */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="alertModalLabel">Notification</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">{alertMessage}</div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Fermer</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Liste des produits */}
        <h2 className="text-center mt-5 mb-3">Produits</h2>
        <div className="row">
          {products.map((prod) => (
            <div className="col-md-4 mb-4" key={prod.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{prod.name}</h5>
                  <p className="card-text">{prod.description}</p>
                  <p className="card-text"><strong>Prix :</strong> {prod.price}FCFA</p>
                  <p className="card-text"><strong>Catégorie :</strong> {prod.category}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(prod)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(prod.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
