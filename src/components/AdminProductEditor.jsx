import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Ajuste de la ruta: Añadimos explícitamente la extensión .jsx para resolver el error de compilación.
import { useAuth } from '../context/AuthContext.jsx'; 
// Importar useParams si estás usando React Router
// import { useParams, useNavigate } from 'react-router-dom'; 

const API_BASE_URL = 'http://localhost:3001/api/services';

// Este componente usa clases de Bootstrap para el maquetado.
export default function AdminProductEditor({ serviceId = '1' }) { 
    // const { id: serviceId } = useParams(); // Descomenta si usas React Router
    // const navigate = useNavigate(); // Descomenta si usas React Router
    
    // Si no se usa React Router, usar un ID de prueba o asegurar que se pase por props.
    // Usamos '1' como valor por defecto si no se pasa, solo para fines de compilación.
    
    const { user, token } = useAuth();
    
    // Estados del formulario y datos
    const [serviceData, setServiceData] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category_id, setCategoryId] = useState('');
    const [imageFile, setImageFile] = useState(null); 
    
    // Estados de control
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Cargar el servicio existente y las categorías
    useEffect(() => {
        const fetchData = async () => {
            if (!serviceId) {
                setIsError(true);
                setMessage('Error: ID de servicio no proporcionado.');
                setIsLoading(false);
                return;
            }

            try {
                // Peticiones concurrentes para el servicio y las categorías
                const [serviceResponse, categoriesResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/${serviceId}`, { 
                        headers: { 'Authorization': `Bearer ${token}` } 
                    }),
                    axios.get(`${API_BASE_URL.replace('/services', '/categories')}`, { 
                        headers: { 'Authorization': `Bearer ${token}` } 
                    }),
                ]);
                
                const data = serviceResponse.data;
                
                // Inicializar estados con datos del servicio
                setServiceData(data);
                setName(data.name || '');
                setDescription(data.description || '');
                setPrice(data.price || '');
                setCategoryId(data.category_id || ''); 

                setCategories(categoriesResponse.data);

            } catch (error) {
                console.error("Error al cargar datos:", error);
                setIsError(true);
                setMessage('Error al cargar datos del servicio o categorías. Verifique el ID y el token.');
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
        
    }, [serviceId, token]); // Dependencia del token para asegurar la autenticación

    // Manejador del cambio de archivo
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // 2. Manejador de Actualización (Update - U de CRUD)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (!name || !price) {
            setIsError(true);
            setMessage('El nombre y el precio son obligatorios.');
            return;
        }
        
        // Creamos FormData para manejar la posible subida de un nuevo archivo
        const formData = new FormData();
        
        // Añadimos campos de texto
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category_id', category_id);

        // SOLO si se seleccionó un nuevo archivo, lo adjuntamos.
        if (imageFile) {
            formData.append('image', imageFile); // 'image' debe coincidir con Multer
        }
        
        try {
            setIsLoading(true);
            
            // Envío de la petición PUT (o PATCH)
            const response = await axios.put(`${API_BASE_URL}/${serviceId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    // Content-Type: multipart/form-data se establece automáticamente
                },
            });

            setMessage(response.data.message || 'Servicio actualizado con éxito.');
            setIsError(false);
            
            // Opcional: Navegar de vuelta a la lista de administración
            // navigate('/admin/products'); 

        } catch (error) {
            console.error('Error al actualizar el servicio:', error.response?.data || error);
            setIsError(true);
            setMessage(error.response?.data?.message || 'Error al actualizar el servicio.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Controles de estado y acceso
    if (!token || (user?.role !== 'admin' && user?.role !== 'developer')) {
        return <div className="alert alert-danger text-center m-5">Acceso denegado. Se requiere autenticación y permisos de administrador.</div>;
    }

    if (isLoading && !serviceData) {
        return <div className="text-center m-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
    }
    
    if (error) {
        return <div className="alert alert-danger text-center m-5">{error}</div>;
    }

    // El maquetado utiliza exclusivamente clases de Bootstrap
    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg border-0 rounded-3">
                        <div className="card-body p-4 p-md-5">
                            <h1 className="text-primary text-center fw-bold mb-4">
                                Editar Servicio: {serviceData?.name || serviceId}
                            </h1>
                            
                            <form onSubmit={handleSubmit}>
                                
                                {/* Imagen Actual (Si existe) */}
                                {serviceData?.imageUrl && !imageFile && (
                                    <div className="mb-4 text-center">
                                        <label className="form-label d-block">Imagen Actual</label>
                                        <img 
                                            src={serviceData.imageUrl} 
                                            alt={`Imagen de ${serviceData.name}`} 
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            className="rounded-circle mt-2 shadow"
                                        />
                                        <p className="text-muted small mt-1">Sube un nuevo archivo para reemplazarla.</p>
                                    </div>
                                )}

                                {/* Nombre */}
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Nombre del Servicio</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                {/* Descripción */}
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Descripción</label>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="3"
                                        className="form-control"
                                    ></textarea>
                                </div>

                                <div className="row g-3 mb-4">
                                    {/* Precio */}
                                    <div className="col-md-6">
                                        <label htmlFor="price" className="form-label">Precio</label>
                                        <input
                                            type="number"
                                            id="price"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            step="0.01"
                                            min="0"
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    {/* Categoría */}
                                    <div className="col-md-6">
                                        <label htmlFor="category" className="form-label">Categoría</label>
                                        <select
                                            id="category"
                                            value={category_id}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">-- Seleccionar Categoría --</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Subida de Nueva Imagen */}
                                <div className="mb-4">
                                    <label htmlFor="image-upload" className="form-label">Subir Nueva Imagen (Opcional)</label>
                                    <input
                                        type="file"
                                        id="image-upload"
                                        name="image" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="form-control"
                                    />
                                    {imageFile && (
                                        <p className="mt-2 text-muted small">Nuevo archivo seleccionado: {imageFile.name}</p>
                                    )}
                                </div>

                                {/* Mensaje de estado */}
                                {message && (
                                    <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mt-4`}>
                                        {message}
                                    </div>
                                )}

                                {/* Botón de envío */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-warning w-100 py-2 mt-4 text-white fw-bold"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}