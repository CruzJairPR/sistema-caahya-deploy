const jwt = require('jsonwebtoken');

/**
 * Verifica que la petición traiga un JWT válido en el header Authorization.
 * Si es válido, adjunta el payload decodificado (id, role) a req.usuario.
 * Si no, responde 401 y corta la petición antes de llegar al controlador.
 */
const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'No autorizado. Token no proporcionado.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // { id, role, iat, exp }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Token inválido o expirado.',
        });
    }
};

module.exports = verificarToken;
