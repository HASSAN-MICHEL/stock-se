import React, { useEffect, useState } from 'react';
import { getStockAlerts } from '../services/stockService';

const StockAlerts = () => {
  const [alertes, setAlertes] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getStockAlerts();
        setAlertes(data);
      } catch (error) {
        console.error('Erreur lors du chargement des alertes de stock');
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Alertes de stock</h2>
      {alertes.length === 0 ? <p>Aucune alerte de stock.</p> : (
        <ul className="list-group">
          {alertes.map((alerte, index) => (
            <li key={index} className="list-group-item list-group-item-danger">
              Produit {alerte.prod_id} : Stock bas ({alerte.quantite} unités restantes)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StockAlerts;
