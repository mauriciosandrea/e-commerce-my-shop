// 🌟 src/pages/Home.jsx
import React from "react";
// Importamos Link para la navegación
import { Link } from "react-router-dom"; 
import "../style/home.css";

const Home = () => {
  return (
    <div className="home-container">
      <section className="intro-section">
        <h1 className="company-title">🔮 Armonía Esotérica</h1>
        <p className="company-description">
          Bienvenido a <strong>Armonía Esotérica</strong>, un espacio dedicado al equilibrio del alma y la energía.
          Ofrecemos consultas de tarot, limpiezas energéticas, cursos espirituales y asesoramiento personalizado.
        </p>
        <p className="company-motto">✨ Conecta con tu camino interior y descubre tu verdadero destino. ✨</p>
        
        {/* NUEVO: Botón Central de Entrada */}
        <Link 
          to="/services" 
          className="enter-portal-button"
        >
          Entrar al Portal de Servicios
        </Link>
        
      </section>

      <section className="services-preview">
        <h2>Servicios Destacados</h2>
        <div className="services-grid">
          <div className="service-card">
            <i className="fa-solid fa-star"></i>
            <h3>Lectura de Tarot</h3>
            <p>Conoce tu presente y futuro con una tirada completa y personalizada.</p>
          </div>
          <div className="service-card">
            <i className="fa-solid fa-hand-sparkles"></i>
            <h3>Limpiezas Energéticas</h3>
            <p>Elimina bloqueos y restaura la armonía espiritual.</p>
          </div>
          <div className="service-card">
            <i className="fa-solid fa-moon"></i>
            <h3>Cursos y Talleres</h3>
            <p>Aprende sobre tarot, energía y espiritualidad con guía profesional.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
