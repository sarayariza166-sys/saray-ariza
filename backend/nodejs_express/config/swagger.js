
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'API Mi Proyecto',
      version: '1.0.0',
      description: 'Documentación completa de la API REST',
      contact: {
        name: 'Albeiro Ramos',
        email: 'profealbeiro2020@gmail.com'
      }
    },

    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://TU-APP-SERVICE.azurewebsites.net'
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production'
          ? 'Servidor en Azure'
          : 'Servidor local'
      }
    ],

    tags: [
      {
        name: 'Usuarios',
        description: 'Operaciones para la gestión de usuarios'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },

      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            name: { type: 'string' },
            lastname: { type: 'string' },
            role: {
              type: 'string',
              enum: ['admin', 'seller', 'user']
            }
          }
        },

        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'usuario@example.com' },
            password: { type: 'string', example: 'contraseña123' }
          }
        },

        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },

    paths: {
      '/api/users/create': {
        post: {
          tags: ['Usuarios'],
          summary: 'Registrar usuario',
          description: 'Registra un nuevo usuario.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: true
                }
              }
            }
          },
          responses: {
            201: { description: 'Usuario registrado' },
            400: { description: 'Datos incorrectos' },
            500: { description: 'Error interno del servidor' }
          }
        }
      },

      '/api/users/login': {
        post: {
          tags: ['Usuarios'],
          summary: 'Iniciar sesión',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Login'
                }
              }
            }
          },
          responses: {
            200: { description: 'Inicio de sesión exitoso' },
            401: { description: 'Credenciales incorrectas' },
            500: { description: 'Error interno del servidor' }
          }
        }
      },

      '/api/users': {
        get: {
          tags: ['Usuarios'],
          summary: 'Listar usuarios',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de usuarios' },
            401: { description: 'No autenticado' },
            403: { description: 'Sin permisos' }
          }
        }
      },

      '/api/users/{id}': {
        get: {
          tags: ['Usuarios'],
          summary: 'Consultar usuario por ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' }
            }
          ],
          responses: {
            200: { description: 'Usuario encontrado' },
            404: { description: 'Usuario no encontrado' },
            401: { description: 'No autenticado' },
            403: { description: 'Sin permisos' }
          }
        },

        put: {
          tags: ['Usuarios'],
          summary: 'Actualizar usuario',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: true
                }
              }
            }
          },
          responses: {
            200: { description: 'Usuario actualizado' },
            401: { description: 'No autenticado' },
            403: { description: 'Sin permisos' },
            404: { description: 'Usuario no encontrado' }
          }
        }
      },

      '/api/users/delete/{id}': {
        delete: {
          tags: ['Usuarios'],
          summary: 'Eliminar usuario',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' }
            }
          ],
          responses: {
            200: { description: 'Usuario eliminado' },
            401: { description: 'No autenticado' },
            403: { description: 'Sin permisos' },
            404: { description: 'Usuario no encontrado' }
          }
        }
      }
    }
  },

  apis: [
    path.join(__dirname, '../routes/*.js')
  ]
};

module.exports = swaggerJsdoc(options);
