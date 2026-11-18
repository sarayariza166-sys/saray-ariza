
const express = require('express');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const usersRoutes = require('./routes/userRoutes');

const app = express();

// ========================================
// MIDDLEWARES
// ========================================

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// CONFIGURACIÓN DE SWAGGER
// ========================================

const swaggerOptions = {
  swaggerOptions: {
    docExpansion: 'list',
    defaultModelsExpandDepth: -1,
    defaultModelExpandDepth: 1,
    displayRequestDuration: true,
    filter: false,
    layout: 'BaseLayout',
    showExtensions: true,
    showCommonExtensions: true,
    deepLinking: true,
    persistAuthorization: true,
    tagsSorter: 'alpha',

    operationsSorter: function (a, b) {
      const methodOrder = {
        post: 1,
        get: 2,
        put: 3,
        delete: 4
      };

      return methodOrder[a.get('method')] -
             methodOrder[b.get('method')];
    }
  }
};

// Publicar documento JSON de Swagger
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// Interfaz visual de Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions)
);

// ========================================
// RUTAS DE LA API
// ========================================

app.use('/api/users', usersRoutes);

// ========================================
// RUTA PRINCIPAL
// ========================================

app.get('/', (req, res) => {
  res.status(200).send('Ruta raíz del Backend');
});

// ========================================
// RUTA DE PRUEBA
// ========================================

app.get('/test', (req, res) => {
  res.status(200).send('Ruta TEST');
});

// ========================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ========================================

app.use((req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada',
    ruta: req.originalUrl
  });
});

// ========================================
// MANEJO DE ERRORES
// ========================================

app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    mensaje: 'Error interno del servidor'
  });
});

// ========================================
// EXPORTAR APLICACIÓN
// ========================================

module.exports = app;
