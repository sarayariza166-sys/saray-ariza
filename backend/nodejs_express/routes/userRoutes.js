
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const {
  verifyToken,
  authorizeRoles
} = require('../middlewares/authMiddleware');

// ========================================
// RUTAS PÚBLICAS
// No requieren autenticación
// ========================================

// Registrar usuario
router.post('/create', userController.register);

// Iniciar sesión
router.post('/login', userController.login);


// ========================================
// RUTAS PROTEGIDAS
// Requieren autenticación
// ========================================

// Listar usuarios
// Permisos: admin y seller
router.get(
  '/',
  verifyToken,
  authorizeRoles(['admin', 'seller']),
  userController.getAllUsers
);

// Consultar usuario por ID
// Permisos: admin y seller
router.get(
  '/:id',
  verifyToken,
  authorizeRoles(['admin', 'seller']),
  userController.getUserById
);

// Actualizar usuario
// Permisos: admin y seller
router.put(
  '/:id',
  verifyToken,
  authorizeRoles(['admin', 'seller']),
  userController.getUserUpdate
);

// Eliminar usuario
// Permiso: únicamente admin
router.delete(
  '/delete/:id',
  verifyToken,
  authorizeRoles(['admin']),
  userController.getUserDelete
);

module.exports = router;
