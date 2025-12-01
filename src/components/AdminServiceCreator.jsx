import React, { useState, useEffect } from "react";

const AdminServiceCreator = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Cargar categorías desde el backend
  useEffect(() => {
    fetch("http://localhost:3001/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  // ✅ Función para manejar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Subiendo servicio...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category_id", categoryId);
      formData.append("image", image); // archivo

      const token = localStorage.getItem("token"); // desde login

      const response = await fetch("http://localhost:3001/api/services", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ⚙️ solo esto, NO "Content-Type"
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Servicio creado: ${data.message}`);
        setName("");
        setDescription("");
        setPrice("");
        setCategoryId("");
        setImage(null);
      } else {
        setMessage(`❌ Error: ${data.message || "No se pudo crear el servicio."}`);
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setMessage("❌ Fallo la conexión con el servidor.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">🛠️ Crear Nuevo Servicio</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del servicio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
          required
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
          required
        />

        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
          required
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
          required
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full mb-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
        >
          Subir Servicio
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
};

export default AdminServiceCreator;
