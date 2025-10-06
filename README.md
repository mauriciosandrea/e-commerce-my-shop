# 🛒 E-Commerce Básico — My Shop 🛍️

Este proyecto es una implementación de una tienda en línea (E-Commerce) moderna y ligera, construida con React y Vite. Se centra en la funcionalidad del lado del cliente, utilizando el **Context API de React** para la gestión global del estado de **Autenticación** y el **Carrito de Compras**.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Descripción | Insignia |
| :--- | :--- | :---: |
| **React** | Biblioteca principal para construir la interfaz de usuario. | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) |
| **Vite** | Herramienta de construcción de próxima generación para un desarrollo rápido. | ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E) |
| **JavaScript (JS)** | Lenguaje de programación principal del proyecto. | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |
| **React Router** | Librería estándar para el enrutamiento de la aplicación (SPA). | ![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) |

---

## ✨ Características Principales

* **Autenticación Básica:** Gestión del estado de usuario (`login`/`logout`) utilizando `AuthContext` y persistencia de sesión a través de `localStorage`.
* **Rutas Protegidas:** Uso de un componente `<ProtectedRoute>` para restringir el acceso a la vista de **Dashboard**.
* **Carrito de Compras:** Gestión del estado del carrito (`añadir`/`vaciar`) utilizando `CartContext`.
* **Estructura Modular:** Organización clara en componentes, contextos y páginas.

---

## 🚀 Instrucciones de Inicio Rápido

Sigue estos pasos para obtener una copia local del proyecto y ponerlo en funcionamiento.

### Prerrequisitos

Necesitas tener [Node.js](https://nodejs.org/) y `npm` (Node Package Manager) instalados en tu máquina.

### Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/mauriciosandrea/e-commerce-my-shop.git](https://github.com/mauriciosandrea/e-commerce-my-shop.git)
    cd e-commerce-my-shop
    ```
    *(Asegúrate de estar en la carpeta donde se encuentra el archivo `package.json`.)*

2.  **Instalar las dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```

El proyecto se abrirá automáticamente en tu navegador, generalmente en `http://localhost:5173`.

---

## 🔑 Credenciales de Prueba (Simuladas)

Dado que este es un proyecto con autenticación de simulación (sin *backend* real), puedes ingresar cualquier combinación de correo electrónico y contraseña.

* **Usuario:** `tu_correo@ejemplo.com`
* **Contraseña:** `cualquier_contraseña`

La función `login` simplemente toma el email y lo usa como nombre de usuario para demostrar la funcionalidad del Contexto.

---

## 📁 Estructura del Proyecto

my-shop/
├─ public/
├─ src/
│  ├─ components/
│  │  └─ Navbar.jsx
│  ├─ context/
│  │  ├─ CartContext.jsx
│  │  └─ AuthContext.jsx
│  ├─ pages/
│  │  ├─ Shop.jsx
│  │  ├─ Cart.jsx
│  │  ├─ Dashboard.jsx (Ruta Protegida)
│  │  ├─ Login.jsx
│  │  └─ Register.jsx
│  ├─ App.jsx
│  └─ main.jsx
├─ package.json
└─ README.md
