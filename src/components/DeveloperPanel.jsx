import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3001/api";

const DeveloperPanel = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: null,
  });
  const [message, setMessage] = useState("");

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        setCategories(data);
      } catch {
        console.error("Error al cargar categorías");
      }
    };
    fetchCategories();
  }, []);

  // Manejar inputs del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Publicar nuevo servicio
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    Object.entries(serviceData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Servicio publicado exitosamente.");
        setServiceData({
          name: "",
          description: "",
          price: "",
          category_id: "",
          image: null,
        });
      } else {
        setMessage(`⚠️ ${result.message || "Error al publicar el servicio."}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al conectar con el servidor.");
    }
  };

  // Acceso rápido
  const goTo = (path) => navigate(path);

  return (
    <div className="container my-5 text-light">
      <h2 className="text-center mb-4">
        🌿 Panel del Desarrollador - {user?.name || ""}
      </h2>

      {/* 🔹 Menú visual */}
      <div className="d-flex justify-content-center gap-3 mb-5">
        <button
          className="btn btn-outline-success"
          onClick={() => goTo("/admin/list")}
        >
          📋 Ver Servicios
        </button>
        <button
          className="btn btn-outline-warning"
          onClick={() => goTo("/admin/create")}
        >
          🪄 Crear Servicio
        </button>
        <button
          className="btn btn-outline-info"
          onClick={() => goTo("/admin/roles")}
        >
          👥 Gestionar Roles
        </button>
      </div>

      {/* 🔹 Formulario de publicación */}
      <div className="card bg-dark text-light shadow-lg p-4">
        <h4 className="mb-3">🧩 Crear nuevo servicio</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Nombre del servicio</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={serviceData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={serviceData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Precio</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={serviceData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Categoría</label>
            <select
              name="category_id"
              className="form-select"
              value={serviceData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Imagen</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            🚀 Publicar Servicio
          </button>
        </form>

        {message && (
          <div className="alert alert-info text-center mt-3">{message}</div>
        )}
      </div>
    </div>
  );
};

export default DeveloperPanel;
