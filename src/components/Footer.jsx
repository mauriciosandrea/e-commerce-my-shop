// ⚙️ src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer-neon">
      <div className="footer-content">
        <p className="footer-title">✨ Armonía Esoterica ✨</p>
        <p className="footer-text">Conectando almas a través del destino.</p>

        <div className="footer-icons">
          <a href="#" className="neon-icon"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="neon-icon"><i className="fab fa-instagram"></i></a>
          <a href="#" className="neon-icon"><i className="fab fa-twitter"></i></a>
          <a href="#" className="neon-icon"><i className="fab fa-whatsapp"></i></a>
        </div>

        <p className="footer-copy">© 2025 Armonía Esoterica - Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
