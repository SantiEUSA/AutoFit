const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Obtener el token del encabezado de la petición HTTP
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de autenticación.' });
  }

  // El formato estándar suele ser: "Bearer <token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    const cifrado = jwt.verify(token, process.env.JWT_SECRET || 'FirmaCriptograficaSantiagoYbarraDAM2026');
    req.usuarioLogueado = cifrado; // Inyecta los datos del usuario autenticado en la petición
    next(); // Permite el paso al controlador correspondiente
  } catch (error) {
    return res.status(403).json({ error: 'Token de autenticación inválido, expirado o alterado.' });
  }
};