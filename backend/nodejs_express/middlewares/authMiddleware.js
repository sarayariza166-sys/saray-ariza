
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

// ========================================
// VERIFICAR TOKEN DE AUTENTICACIÓN
// ========================================
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // Comprobar que exista el encabezado
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No se proporcionó un token de autenticación",
    });
  }

  // Aceptar los formatos Bearer token o JWT token
  const parts = authHeader.trim().split(/\s+/);

  if (
    parts.length !== 2 ||
    !["Bearer", "JWT"].includes(parts[0])
  ) {
    return res.status(401).json({
      success: false,
      message: "Formato de token inválido",
    });
  }

  const token = parts[1];

  // Verificar el token
  jwt.verify(token, keys.secretOrKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }

    // Guardar los datos del usuario autenticado
    req.user = decoded;

    next();
  });
}

// ========================================
// AUTORIZAR SEGÚN EL ROL
// ========================================
function authorizeRoles(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Debes iniciar sesión",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: se requiere rol ${roles.join(" o ")}`,
      });
    }

    next();
  };
}

module.exports = {
  verifyToken,
  authorizeRoles,
};
