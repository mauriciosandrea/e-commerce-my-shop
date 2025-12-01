import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext'; 

const BACKEND_URL = 'http://localhost:3001';
const bgColor = '#1a331a'; 
const accentColor = '#90ee90'; 
const textColor = '#e6ffe6';

// --- NUEVO COMPONENTE: Menú Lateral de Categorías ---
const CategoriesSidebar = ({ isOpen, toggleSidebar, categories, navigate }) => (
    <aside 
        className={`sidebar ${isOpen ? 'open' : ''}`} // Clase CSS para manejar la apertura
        style={{ 
            backgroundColor: '#0d281a', 
            color: textColor,
            // AJUSTE CRÍTICO: Empujar el contenido hacia abajo, debajo del navbar fijo.
            paddingTop: '80px' 
        }}
    >
        <div className="sidebar-header"> 
            
            {/* Botón para ir a la página anterior */}
            <button 
                onClick={() => {
                    navigate(-1); // Función para ir atrás en el historial
                    toggleSidebar(); // Cierra el menú al navegar
                }}
                className="sidebar-back-button"
                style={{ 
                    color: textColor, 
                    fontSize: '1.5em',
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: '0 10px 0 0' 
                }}
            >
                &larr; {/* Flecha hacia la izquierda */}
            </button>
            
            {/* Título de la sección */}
            <h3 style={{ 
                paddingBottom: '10px', 
                marginBottom: '15px',
                flexGrow: 1, 
                marginTop: 0 
            }}>
                Servicios
            </h3>
        </div>
        
        {/* Lista de categorías */}
        <ul>
            <li key="all">
                <Link to="/services" onClick={toggleSidebar}>
                    Todas las Consultas
                </Link>
            </li>
            {categories.map(cat => (
                <li key={cat.id}>
                    <Link to={`/services?category_id=${cat.id}`} onClick={toggleSidebar}>
                        {cat.name}
                    </Link>
                </li>
            ))}
            {/* Asegura que el footer no se superponga con el contenido */}
        </ul>
    </aside>
);

const Navbar = () => {
    const { currentUser, logout } = useAuth(); 
    const { cartItems } = useCart(); 
    const navigate = useNavigate(); 

    // ESTADOS
    const [categories, setCategories] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Función para alternar el menú lateral
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    
    // Cargar categorías al inicio
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/categories`);
                if (!response.ok) throw new Error('Fallo al cargar categorías');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleLogout = () => {
        logout(); 
        navigate('/login'); 
    };

    const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const userRole = currentUser ? currentUser.role : 'user';

    return (
        <>
            {/* 1. Menú Lateral (Sidebar) */}
            <CategoriesSidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                categories={categories}
                navigate={navigate} 
            />
            
            {/* 2. Barra de Navegación Principal */}
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '15px 30px', 
                backgroundColor: bgColor, 
                color: textColor,
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                position: 'sticky', // Se mantiene fijo en la parte superior
                top: 0,
                zIndex: 100, // Asegura que esté sobre el contenido normal
            }}>
                
                {/* INICIO: Menú Hamburguesa y Logo */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button 
                        className="menu-toggle" 
                        onClick={toggleSidebar}
                        style={{ background: 'none', border: 'none', color: textColor, fontSize: '1.5em', cursor: 'pointer' }}
                    >
                        ☰
                    </button>
                    <Link 
                        to="/" 
                        style={{ color: accentColor, textDecoration: 'none', fontSize: '1.8em', fontWeight: 'bold', marginLeft: '10px' }}
                    >
                        🌿 Armonia Esoterica
                    </Link>
                </div>
                {/* FIN: Menú Hamburguesa y Logo */}

                <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                    
                    {/* ENLACE CONDICIONAL DE ROLES */}
                    {userRole === 'developer' && (
                        <Link 
                            to="/panel/developer" 
                            className="nav-links" 
                            style={{ color: '#ffcc00', textDecoration: 'none', fontSize: '1.1em', fontWeight: 'bold' }} // Color llamativo para Developer
                        >
                            🛠️ Desarrollador
                        </Link>
                    )}
                    {userRole === 'admin' && (
                        <Link 
                            to="/panel/admin" 
                            className="nav-links" 
                            style={{ color: '#ffcc00', textDecoration: 'none', fontSize: '1.1em', fontWeight: 'bold' }}
                        >
                            ⚙️ Administración
                        </Link>
                    )}
                    
                    {/* Enlace al Carrito/Cesta */}
                    <Link 
                        to="/cart" 
                        style={{ color: accentColor, textDecoration: 'none', fontSize: '1.1em', position: 'relative' }}
                    >
                        🛒 Cesta ({totalItems}) 
                    </Link>
                    
                    {currentUser ? (
                        /* --- ESTADO LOGUEADO --- */
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <span style={{ color: textColor }}>
                                Hola, **{currentUser.name}**
                            </span>
                            
                            <Link 
                                to="/dashboard" 
                                style={{ color: textColor, textDecoration: 'none', fontSize: '1.1em' }}
                            >
                                Mi Cuenta
                            </Link>
                            
                            <button 
                                onClick={handleLogout} 
                                style={{ background: '#FF4500', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        /* --- ESTADO NO LOGUEADO --- */
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <Link 
                                to="/login" 
                                style={{ color: textColor, textDecoration: 'none' }}
                            >
                                Iniciar Sesión
                            </Link>
                            <Link 
                                to="/register"
                                style={{ background: accentColor, color: bgColor, padding: '8px 15px', border: 'none', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}
                            >
                                Registro
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;