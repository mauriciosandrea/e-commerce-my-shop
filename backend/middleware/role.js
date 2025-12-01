// ⚙️ backend/middleware/role.js

/**
 * @description Middleware para restringir el acceso a una lista de roles.
 * Debe ejecutarse DESPUÉS de verifyToken, ya que depende de req.user.role.
 */
const verifyRole = (roles) => (req, res, next) => {
    // 1. Verificar si el token proporcionó información de usuario y rol.
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Acceso denegado. Información de rol no disponible.' });
    }

    // 2. Comprobar si el rol del usuario está incluido en la lista de roles permitidos.
    if (!roles.includes(req.user.role)) {
        console.warn(`Intento de acceso denegado. User ID: ${req.user.id}, Rol: ${req.user.role}, Requiere: ${roles.join(', ')}`);
        return res.status(403).json({ message: 'Acceso denegado. No tienes el rol requerido.' });
    }

    // 3. Si el rol coincide, permitir el acceso.
    next();
};

module.exports = { verifyRole };