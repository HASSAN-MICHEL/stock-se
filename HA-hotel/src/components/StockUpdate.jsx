import React, { useState } from 'react';
import { updateStock } from '../services/stockService';

const StockUpdate = () => {
  const [produitId, setProduitId] = useState('');
  const [quantite, setQuantite] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    try {
      await updateStock(produitId, parseInt(quantite));
      setMessage('Stock mis à jour avec succès !');
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du stock.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Mettre à jour le stock</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="ID du produit" value={produitId} onChange={(e) => setProduitId(e.target.value)} />
      </div>
      <div className="mb-3">
        <input type="number" className="form-control" placeholder="Nouvelle quantité" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
      </div>
      <button className="btn btn-warning" onClick={handleUpdate}>Mettre à jour</button>
      {message && <div className="alert mt-3">{message}</div>}
    </div>
  );
};

export default StockUpdate;
