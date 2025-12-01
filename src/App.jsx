import React from "react";
import { Routes, Route } from "react-router-dom";

// 🧩 Componentes globales
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// 🪐 Páginas de Usuario
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage"; 

// ⚙️ Componentes de Administración
import AdminProductList from "./components/AdminProductList";
import AdminServiceCreator from "./components/AdminServiceCreator";
import AdminProductEditor from "./components/AdminProductEditor";

// 🧠 Panel del Desarrollador
import DeveloperPanel from "./components/DeveloperPanel";

// 🎨 Estilos globales
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "./style/footer.css";
// import "./style/background.css"; 

const App = () => {
  return (
    <div className="app-container">
      {/* 🌠 Fondo animado estelar */}
      <div className="star-background"></div>

      {/* 🚀 Contenido principal */}
      <div className="content-wrapper">
        <Navbar />

        <main
          style={{
            padding: "20px",
            minHeight: "70vh",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Routes>

            {/* 🌍 RUTAS PÚBLICAS */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 👤 RUTAS PROTEGIDAS DE USUARIO */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ⚙️ RUTAS DE ADMINISTRACIÓN */}
            <Route
              path="/admin/list"
              element={
                <ProtectedRoute requiresRole="admin">
                  <AdminProductList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/create"
              element={
                <ProtectedRoute requiresRole="admin">
                  <AdminServiceCreator />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/edit/:serviceId"
              element={
                <ProtectedRoute requiresRole="admin">
                  <AdminProductEditor />
                </ProtectedRoute>
              }
            />

            {/* 💻 RUTA DEL PANEL DE DESARROLLADOR */}
            <Route
              path="/panel/developer"
              element={
                <ProtectedRoute requiresRole="developer">
                  <DeveloperPanel />
                </ProtectedRoute>
              }
            />

            {/* 🚨 ERROR 404 */}
            <Route
              path="*"
              element={
                <div
                  style={{
                    color: "#e57373",
                    textAlign: "center",
                    marginTop: "100px",
                  }}
                >
                  <h1>404 | Portal Desconocido</h1>
                  <p>La consulta astral que buscas no existe en este plano.</p>
                </div>
              }
            />

          </Routes>
        </main>

        {/* 🌌 Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default App;
