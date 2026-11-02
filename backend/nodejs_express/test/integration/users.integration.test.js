
const request = require('supertest');
const app = require('../../server');
const db = require('../../config/config');

const TEST_EMAIL = `integracion_${Date.now()}@test.com`;
const PASSWORD = 'Prueba123*';

let userId;
let adminToken;

jest.setTimeout(20000);

describe('PRUEBAS DE INTEGRACIÓN REAL - MYSQL', () => {

  // Crear un administrador para autorizar las pruebas protegidas
  beforeAll(async () => {
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const keys = require('../../config/keys');

    const passwordHash = await bcrypt.hash('Admin123*', 10);

    const adminEmail = `admin_${Date.now()}@test.com`;

    const admin = await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users
        (name, lastname, email, password, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        ['Admin', 'Pruebas', adminEmail, passwordHash, 'admin'],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    adminToken = `JWT ${jwt.sign(
      {
        id: admin.insertId,
        email: adminEmail,
        role: 'admin'
      },
      keys.secretOrKey,
      { expiresIn: '1h' }
    )}`;
  });

  // IT-01: Registrar usuario
  test('IT-01 - Debe registrar un usuario en MySQL', async () => {
    const response = await request(app)
      .post('/api/users/create')
      .send({
        name: 'Usuario',
        lastname: 'Integracion',
        email: TEST_EMAIL,
        password: PASSWORD,
        phone: '3001234567',
        role: 'user'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    userId = response.body.data.id;
    expect(userId).toBeDefined();
  });

  // IT-02: Iniciar sesión
  test('IT-02 - Debe iniciar sesión con el usuario registrado', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: TEST_EMAIL,
        password: PASSWORD
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.session_token).toContain('JWT ');
  });

  // IT-03: Listar usuarios como administrador
  test('IT-03 - Debe listar usuarios con token de administrador', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', adminToken);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // IT-04: Actualizar usuario
  test('IT-04 - Debe actualizar el usuario registrado', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', adminToken)
      .send({
        name: 'UsuarioActualizado',
        phone: '3109876543'
      });

    expect(response.status).toBe(200);
  });

  // IT-05: Eliminar usuario
  test('IT-05 - Debe eliminar el usuario registrado', async () => {
    const response = await request(app)
      .delete(`/api/users/delete/${userId}`)
      .set('Authorization', adminToken);

    expect([200, 201]).toContain(response.status);
  });

  // Limpiar únicamente el administrador creado por esta prueba
  afterAll(async () => {
    if (adminToken) {
      const jwt = require('jsonwebtoken');
      const keys = require('../../config/keys');
      const decoded = jwt.verify(adminToken.split(' ')[1], keys.secretOrKey);

      await new Promise((resolve) => {
        db.query(
          'DELETE FROM users WHERE id = ?',
          [decoded.id],
          () => resolve()
        );
      });
    }

    db.end();
  });
});
