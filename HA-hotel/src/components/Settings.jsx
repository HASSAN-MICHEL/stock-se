import { useState, useEffect } from 'react';
import { 
  FiSettings, 
  FiMoon, 
  FiSun, 
  FiGlobe, 
  FiBell, 
  FiSave,
  FiUser,
  FiLock,
  FiMail,
  FiDatabase
} from 'react-icons/fi';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Tab, 
  Tabs,
  Badge,
  Alert
} from 'react-bootstrap';

export default function Settings() {
  // États pour les paramètres
  const [settings, setSettings] = useState({
    language: 'fr',
    theme: 'light',
    primaryColor: '#0d6efd', // Bleu Bootstrap par défaut
    notifications: true,
    emailReports: false,
    autoRefresh: true,
    fontSize: 'medium'
  });

  // États pour les onglets
  const [key, setKey] = useState('appearance');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Charger les paramètres sauvegardés
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Sauvegarder les paramètres
  const saveSettings = () => {
    setIsSaving(true);
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Simulation d'un appel API
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Couleurs prédéfinies
  const colorOptions = [
    { name: 'Bleu', value: '#0d6efd' },
    { name: 'Vert', value: '#198754' },
    { name: 'Rouge', value: '#dc3545' },
    { name: 'Orange', value: '#fd7e14' },
    { name: 'Violet', value: '#6f42c1' },
    { name: 'Rose', value: '#d63384' }
  ];

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="d-flex align-items-center">
            <FiSettings className="me-2" /> Paramètres de l'Application
          </h2>
          <p className="text-muted">
            Personnalisez l'apparence et le comportement de l'application
          </p>
        </Col>
      </Row>

      {saveStatus === 'success' && (
        <Alert variant="success" className="mb-4" onClose={() => setSaveStatus(null)} dismissible>
          Les paramètres ont été sauvegardés avec succès !
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-4"
            fill
          >
            <Tab eventKey="appearance" title={
              <span><FiSun className="me-1" /> Apparence</span>
            }>
              <Form className="mt-4">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>
                        <FiMoon className="me-2" /> Thème
                      </Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          id="theme-light"
                          label={
                            <span className="d-flex align-items-center">
                              <FiSun className="me-2" /> Clair
                            </span>
                          }
                          name="theme"
                          value="light"
                          checked={settings.theme === 'light'}
                          onChange={handleChange}
                          inline
                        />
                        <Form.Check
                          type="radio"
                          id="theme-dark"
                          label={
                            <span className="d-flex align-items-center">
                              <FiMoon className="me-2" /> Sombre
                            </span>
                          }
                          name="theme"
                          value="dark"
                          checked={settings.theme === 'dark'}
                          onChange={handleChange}
                          inline
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>
                        <FiGlobe className="me-2" /> Langue
                      </Form.Label>
                      <Form.Select
                        name="language"
                        value={settings.language}
                        onChange={handleChange}
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>
                        <span style={{ color: settings.primaryColor }}>
                          <FiSun className="me-2" />
                        </span>
                        Couleur principale
                      </Form.Label>
                      <div className="d-flex flex-wrap gap-2">
                        {colorOptions.map(color => (
                          <div 
                            key={color.value}
                            className="color-option"
                            style={{
                              backgroundColor: color.value,
                              border: settings.primaryColor === color.value 
                                ? '3px solid #495057' 
                                : '1px solid #dee2e6',
                              cursor: 'pointer'
                            }}
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              primaryColor: color.value
                            }))}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Taille de texte</Form.Label>
                      <Form.Select
                        name="fontSize"
                        value={settings.fontSize}
                        onChange={handleChange}
                      >
                        <option value="small">Petit</option>
                        <option value="medium">Moyen</option>
                        <option value="large">Grand</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Tab>

            <Tab eventKey="notifications" title={
              <span><FiBell className="me-1" /> Notifications</span>
            }>
              <Form className="mt-4">
                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    id="notifications-switch"
                    label={
                      <span className="d-flex align-items-center">
                        <FiBell className="me-2" />
                        Activer les notifications
                        {settings.notifications && (
                          <Badge bg="success" className="ms-2">Activé</Badge>
                        )}
                      </span>
                    }
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    id="email-reports-switch"
                    label="Recevoir des rapports par email"
                    name="emailReports"
                    checked={settings.emailReports}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            </Tab>

            <Tab eventKey="account" title={
              <span><FiUser className="me-1" /> Compte</span>
            }>
              <Form className="mt-4">
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FiMail className="me-2" /> Email
                  </Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Votre adresse email" 
                    defaultValue="user@example.com"
                    disabled
                  />
                </Form.Group>

                <Button variant="outline-primary" className="me-2">
                  <FiLock className="me-2" /> Changer le mot de passe
                </Button>
              </Form>
            </Tab>

            <Tab eventKey="advanced" title={
              <span><FiDatabase className="me-1" /> Avancé</span>
            }>
              <Form className="mt-4">
                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    id="auto-refresh-switch"
                    label="Actualisation automatique des données"
                    name="autoRefresh"
                    checked={settings.autoRefresh}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="outline-danger">
                    Purger le cache
                  </Button>
                  <Button variant="outline-secondary">
                    Exporter les données
                  </Button>
                </div>
              </Form>
            </Tab>
          </Tabs>

          <div className="d-flex justify-content-end border-top pt-3">
            <Button 
              variant="primary" 
              onClick={saveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <FiSave className="me-2" />
                  Sauvegarder les paramètres
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <style>{`
        .color-option {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: transform 0.2s;
        }
        .color-option:hover {
          transform: scale(1.1);
        }
        .nav-link {
          display: flex;
          align-items: center;
        }
      `}</style>
    </Container>
  );
}