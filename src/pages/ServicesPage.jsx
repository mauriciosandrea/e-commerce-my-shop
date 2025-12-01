import React from 'react';
// 1. Importamos el componente ServiceCard del usuario
import ServiceCard from '../components/ServiceCard'; 
import '../style/services.css'; // Importamos estilos dedicados

// 2. Renombramos las propiedades de los datos para que coincidan con ServiceCard.jsx
const SERVICES_DATA = [
    // El componente ServiceCard.jsx espera 'name' y 'description'
    { name: "Tirada de Cruz Celta", description: "Análisis profundo de una situación actual con el método más popular.", price: 35.00 },
    { name: "Lectura Anual 12 Casas", description: "Predicciones y energías para cada mes del año.", price: 70.00 },
    { name: "Consulta de Amor y Pareja", description: "Claridad sobre dinámicas de relación y caminos futuros.", price: 45.00 },
    { name: "Tirada de Vidas Pasadas", description: "Descubre tus raíces kármicas e influencias del pasado.", price: 50.00 },
    { name: "Revisión de Karma", description: "Entiende las lecciones de tu destino y bloqueos kármicos.", price: 65.00 },
    { name: "Oráculo de los Ángeles", description: "Mensajes directos de tus guías espirituales para el presente.", price: 40.00 },
];

// Eliminamos el antiguo componente 'ServiceCard' de este archivo.

const ServicesPage = () => {
    return (
        <div className="services-page-container">
            <h1 className="services-title">Nuestros Servicios de Tarot y Guía Espiritual</h1>
            <div className="services-grid-full">
                {SERVICES_DATA.map((service, index) => (
                    // 3. Usamos el componente ServiceCard importado y le pasamos todo el objeto service.
                    <ServiceCard key={index} service={service} />
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;
