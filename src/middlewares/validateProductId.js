// Middleware pour vérifier que le produit_id est un entier valide
export const checkProductIdValid = (req, res, next) => {
    const { produit_id } = req.params;
  
    if (!Number.isInteger(parseInt(produit_id))) {
      return res.status(400).json({ message: 'ID de produit invalide.' });
    }
  
    next();
  };
  