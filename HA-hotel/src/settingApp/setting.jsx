import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import { Card, Form, Table, Badge } from 'react-bootstrap';

const Settings = () => {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    authUsers,
    currentUser
  } = useContext(AppContext);

  const themes = ['light', 'dark', 'primary', 'secondary'];
  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  return (
    <Card>
      <Card.Header>
        <h4>Paramètres de l'application</h4>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Thème</Form.Label>
            <Form.Select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
            >
              {themes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Langue</Form.Label>
            <Form.Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {currentUser?.role === 'admin' && (
            <>
              <h5 className="mt-4">Historique des connexions</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Rôle</th>
                    <th>Date/Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {authUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.username}</td>
                      <td>
                        <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td>{new Date(user.loginTime).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="mt-4">
                <h5>Version de l'application</h5>
                <p>Version 1.0.0 - © 2023 Gestion Stock</p>
              </div>
            </>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Settings;