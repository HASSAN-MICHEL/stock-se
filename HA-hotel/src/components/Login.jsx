import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'authentification simple pour l'exemple
    if (username === 'admin' && password === 'admin') {
      onLogin();
      navigate('/');
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center mb-0">Connexion</h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Entrez votre nom d'utilisateur"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Se connecter
                </button>
              </form>
              <div className="text-center mt-3">
                <a href="#forgot-password" className="text-decoration-none">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;