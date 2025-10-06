// ⚙️ src/pages/Shop.jsx

import React, { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard'; // 👈 Importamos el componente modular

// URL de una API de prueba (simulando que obtenemos 6 servicios)
const API_URL = 'https://jsonplaceholder.typicode.com/users'; 

const Shop = () => {
  // 1. Estados necesarios para la llamada a la API
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(API_URL);
        
        // Manejo de errores de respuesta HTTP (404, 500, etc.)
        if (!response.ok) {
          throw new Error(`Error en la red: ${response.statusText}`);
        }

        let data = await response.json();

        // Mapeamos los datos de la API de prueba (users) a servicios de Tarot
        const tarotServices = data.slice(0, 6).map((user, index) => {
          const serviceNames = [
            "Tirada de Cruz Celta",
            "Lectura Anual 12 Casas",
            "Consulta de Amor y Pareja",
            "Tirada de Vidas Pasadas",
            "Revisión de Karma",
            "Oráculo de los Ángeles",
          ];
          const serviceDescriptions = [
             "Análisis profundo de una situación actual con el método más popular.",
             "Predicciones y energías para cada mes del año.",
             "Claridad sobre dinámicas de relación y caminos futuros.",
             "Descubre tus raíces kármicas e influencias del pasado.",
             "Entiende las lecciones de tu destino y bloqueos kármicos.",
             "Mensajes directos de tus guías espirituales para el presente.",
          ];
          const servicePrices = [35.00, 70.00, 45.00, 50.00, 65.00, 40.00];

          return {
            id: user.id,
            name: serviceNames[index],
            price: servicePrices[index],
            description: serviceDescriptions[index],
          };
        });

        setServices(tarotServices);
        setError(null); 
      } catch (err) {
        console.error("Error al obtener servicios:", err);
        setError("🔮 Lo sentimos, no pudimos contactar al Oráculo. Intente recargar.");
      } finally {
        setIsLoading(false); // Detenemos la carga, pase lo que pase
      }
    };

    fetchServices();
  }, []); // El array vacío ejecuta la función SOLO al montar

  // 2. Renderizado Condicional de Estados (UX)
  if (isLoading) {
    return <h1 style={{ textAlign: 'center', marginTop: '50px', color: '#9B59B6' }}>Consultando al cosmos... ⏳</h1>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: '#E74C3C', marginTop: '50px' }}>
        <h1>{error}</h1>
        <p style={{ color: '#E74C3C' }}>Verifique su conexión a Internet o intente de nuevo en unos minutos.</p>
      </div>
    );
  }

  // 3. Renderizado final
  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#FFD700', marginBottom: '30px' }}>
        Nuestros Servicios de Tarot y Guía Espiritual
      </h1>
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} /> 
        ))}
      </div>
    </div>
  );
};

export default Shop;