import React, { useState, useEffect, useMemo } from "react";
import { Pencil, Trash2, PlusCircle, AlertTriangle, X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

// URL base de la API (Asegúrate de que tu backend esté corriendo en este puerto)
const API_BASE_URL = "http://localhost:3001/api/services";

/**
 * Componente de listado y administración de servicios (CRUD: Read, Delete).
 * Implementa búsqueda, paginación y usa Bootstrap.
 */
export default function AdminProductList() {
    // Estado principal de la aplicación
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Estado de Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 10;
    
    // Estado del Modal de Confirmación de Eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    // --- LÓGICA DE DATOS Y EFECTOS ---
    
    // Función para obtener los servicios de la API usando fetch()
    const fetchServices = async () => {
        if (!token) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                // Si la respuesta no es 200-299, lanzar un error
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cargar los servicios.');
            }

            const data = await response.json();
            setServices(data);
        } catch (err) {
            console.error("Error al obtener servicios:", err);
            setError(err.message || "No se pudieron cargar los servicios. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar los servicios al montar el componente
    useEffect(() => {
        fetchServices();
    }, [token]);

    // Función para eliminar un servicio
    const deleteService = async (serviceId) => {
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar el servicio.');
            }
            
            // Recargar la lista después de la eliminación exitosa
            fetchServices(); 
            // Cerrar modal
            setIsDeleteModalOpen(false); 
        } catch (err) {
            console.error("Error al eliminar servicio:", err);
            setError(err.message || "No se pudo eliminar el servicio.");
        }
    };

    // --- LÓGICA DE BÚSQUEDA Y PAGINACIÓN (Requerimiento #4) ---
    
    // 1. Filtrar servicios basado en el término de búsqueda
    const filteredServices = useMemo(() => {
        if (!searchTerm) {
            return services;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        return services.filter(service => 
            service.name?.toLowerCase().includes(lowerCaseSearch) ||
            service.description?.toLowerCase().includes(lowerCaseSearch)
        );
    }, [services, searchTerm]);

    // 2. Calcular datos de paginación
    const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
    const currentServices = useMemo(() => {
        const startIndex = (currentPage - 1) * servicesPerPage;
        const endIndex = startIndex + servicesPerPage;
        return filteredServices.slice(startIndex, endIndex);
    }, [filteredServices, currentPage, servicesPerPage]);

    // 3. Manejadores de paginación
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // --- LÓGICA DEL MODAL ---
    
    const openDeleteModal = (service) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (serviceToDelete) {
            deleteService(serviceToDelete.id);
        }
    };

    // --- RENDERIZADO DE LA VISTA ---

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-white mt-2">Cargando servicios astrales...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger mx-auto mt-4" style={{ maxWidth: '600px' }}>
                <h5>Error de Carga</h5>
                <p>Ocurrió un error: {error}</p>
                <button className="btn btn-sm btn-outline-danger" onClick={fetchServices}>
                    Intentar de Nuevo
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-primary fw-bold text-center mb-5">
                Panel de Administración de Servicios
            </h1>

            {/* BARRA DE HERRAMIENTAS Y BÚSQUEDA */}
            <div className="row g-3 align-items-center mb-4">
                <div className="col-md-8 col-lg-9">
                    <div className="input-group">
                        <span className="input-group-text bg-dark border-primary text-white">
                            <Search size={20} />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre o descripción..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Resetear a la primera página al buscar
                            }}
                        />
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 d-grid">
                    <button 
                        className="btn btn-success d-flex align-items-center justify-content-center"
                        onClick={() => navigate('/admin/create')}
                    >
                        <PlusCircle size={20} className="me-2" />
                        Crear Nuevo Servicio
                    </button>
                </div>
            </div>

            {/* TABLA DE SERVICIOS */}
            <div className="table-responsive bg-light rounded shadow-lg p-3">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Categoría</th>
                            <th scope="col" className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentServices.length > 0 ? (
                            currentServices.map((service, index) => (
                                <tr key={service.id}>
                                    <th scope="row">{(currentPage - 1) * servicesPerPage + index + 1}</th>
                                    <td>{service.name}</td>
                                    <td>${service.price ? service.price.toFixed(2) : 'N/A'}</td>
                                    <td>{service.category_name || 'Sin Categoría'}</td>
                                    <td className="text-center" style={{ minWidth: '150px' }}>
                                        <button 
                                            className="btn btn-sm btn-info text-white me-2"
                                            onClick={() => navigate(`/admin/edit/${service.id}`)}
                                            title="Editar"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => openDeleteModal(service)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">
                                    No se encontraron servicios que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
                <nav aria-label="Navegación de Páginas" className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={16} /> Anterior
                            </button>
                        </li>
                        
                        {/* Renderizado simple de página actual / total */}
                        <li className="page-item disabled">
                            <span className="page-link">
                                Página {currentPage} de {totalPages}
                            </span>
                        </li>

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente <ChevronRight size={16} />
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {isDeleteModalOpen && serviceToDelete && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-danger text-white border-0">
                                <h5 className="modal-title">
                                    <AlertTriangle size={24} className="me-2" />
                                    Confirmar Eliminación
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setIsDeleteModalOpen(false)} aria-label="Cerrar"></button>
                            </div>
                            <div className="modal-body text-dark">
                                <p>
                                    ¿Estás seguro de que deseas eliminar el servicio 
                                    <strong className="text-danger"> "{serviceToDelete.name}"</strong>?
                                    Esta acción es irreversible.
                                </p>
                            </div>
                            <div className="modal-footer border-0">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    <X size={16} className="me-1" /> Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={handleConfirmDelete}
                                >
                                    <Trash2 size={16} className="me-1" /> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}