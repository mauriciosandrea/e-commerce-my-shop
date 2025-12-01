// ⚙️ backend/middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * @description Middleware para verificar la validez del token JWT
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó el token.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido. Use Bearer <token>.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contiene id, email, rol, etc.
        next();
    } catch (error) {
        console.error("Error de verificación de token:", error);
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

/**
 * @description Middleware para verificar si el rol del usuario está autorizado
 * @param {Array<string>} rolesPermitidos - Ejemplo: ['admin', 'developer']
 */
const verifyRole = (rolesPermitidos = []) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(403).json({ message: 'No se pudo determinar el rol del usuario.' });
        }

        if (!rolesPermitidos.includes(userRole)) {
            return res.status(403).json({
                message: `Intento de acceso denegado. User ID: ${req.user.id}, Rol: ${userRole}, Requiere: ${rolesPermitidos.join(', ')}`
            });
        }

        next();
    };
};

module.exports = { verifyToken, verifyRole };
