import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Assure-toi que ce fichier existe
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
console.log("main.jsx est bien exécuté !");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
