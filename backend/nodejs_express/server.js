
const express = require('express');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const usersRoutes = require('./routes/userRoutes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    operationsSorter: function(a, b) {
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

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions)
);

app.use('/api/users', usersRoutes);

app.get('/', (req, res) => {
  res.send('Ruta raíz del Backend');
});

app.get('/test', (req, res) => {
  res.send('Ruta TEST');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    mensaje: 'Error interno del servidor'
  });
});

// Exportar Express sin iniciar el servidor
module.exports = app;
