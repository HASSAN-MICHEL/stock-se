-- Création de la base de données
CREATE DATABASE projet;

-- Connexion à la base de données
\c ha_hotel;

-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'reception', 'restaurant', 'bar')) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des clients
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telephone VARCHAR(20),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des chambres
CREATE TABLE chambres (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(10) UNIQUE NOT NULL,
    type VARCHAR(50) CHECK (type IN ('simple', 'double', 'suite')) NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    statut VARCHAR(20) CHECK (statut IN ('disponible', 'occupée', 'réservée')) NOT NULL DEFAULT 'disponible'
);

-- Table des réservations
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE CASCADE,
    chambre_id INT REFERENCES chambres(id) ON DELETE CASCADE,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut VARCHAR(20) CHECK (statut IN ('confirmée', 'annulée', 'terminée')) DEFAULT 'confirmée',
    montant_total DECIMAL(10,2) NOT NULL,
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des menus (repas et boissons)
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    categorie VARCHAR(50) CHECK (categorie IN ('repas', 'boisson')) NOT NULL,
    prix DECIMAL(10,2) NOT NULL
);

-- Table des boissons
CREATE TABLE boissons (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0)
);

-- Table des commandes (restaurant et bar)
CREATE TABLE commandes (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE CASCADE,
    type_commande VARCHAR(50) CHECK (type_commande IN ('restaurant', 'bar')) NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des ventes de boissons du bar
CREATE TABLE ventes_boissons (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE CASCADE,
    boisson_id INT REFERENCES boissons(id) ON DELETE CASCADE,
    quantite INT NOT NULL CHECK (quantite > 0),
    montant_total DECIMAL(10,2) NOT NULL,
    date_vente TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des factures
CREATE TABLE factures (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE CASCADE,
    reservation_id INT REFERENCES reservations(id) ON DELETE SET NULL,
    commande_id INT REFERENCES commandes(id) ON DELETE SET NULL,
    vente_boisson_id INT REFERENCES ventes_boissons(id) ON DELETE SET NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    date_facture TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des commandes (restaurant et bar)
CREATE TABLE commandes (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE CASCADE,
    type_commande VARCHAR(50) CHECK (type_commande IN ('restaurant', 'bar')) NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des menus (repas et boissons)
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    categorie VARCHAR(50) CHECK (categorie IN ('repas', 'boisson')) NOT NULL,
    prix DECIMAL(10,2) NOT NULL
);
