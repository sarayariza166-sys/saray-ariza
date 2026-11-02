
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../server');
const db = require('../../config/config');

const PASSWORD = 'password123';
const ADMIN_EMAIL = `admin_${Date.now()}@test.com`;
const USER_EMAIL = `user_${Date.now()}@test.com`;

let tokenAdmin = '';
let tokenUser = '';
let adminId;
let userId;

jest.setTimeout(20000);

describe('Nivel 3: Pruebas Funcionales - Caja Negra con MySQL', () => {

  // Preparar usuarios de prueba
  beforeAll(async () => {
    const hash = await bcrypt.hash(PASSWORD, 10);

    const insertUser = (name, email, role) => {
      return new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO users
          (name, lastname, email, password, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
          [name, 'Test', email, hash, role],
          (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId);
          }
        );
      });
    };

    adminId = await insertUser('Admin', ADMIN_EMAIL, 'admin');
    userId = await insertUser('User', USER_EMAIL, 'user');

    const loginAdmin = await request(app)
      .post('/api/users/login')
      .send({
        email: ADMIN_EMAIL,
        password: PASSWORD
      });

    tokenAdmin = loginAdmin.body.data.session_token;

    const loginUser = await request(app)
      .post('/api/users/login')
      .send({
        email: USER_EMAIL,
        password: PASSWORD
      });

    tokenUser = loginUser.body.data.session_token;

    expect(loginAdmin.status).toBe(201);
    expect(loginUser.status).toBe(201);
  });

  // FT-01: Correo duplicado
  test('FT-01: No debe permitir registrar un correo duplicado', async () => {
    const response = await request(app)
      .post('/api/users/create')
      .send({
        name: 'Copia',
        lastname: 'Test',
        email: ADMIN_EMAIL,
        password: PASSWORD
      });

    expect(response.status).toBe(501);
    expect(response.body.success).toBe(false);
  });

  // FT-02: Contraseña incorrecta
  test('FT-02: Debe rechazar una contraseña incorrecta', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: ADMIN_EMAIL,
        password: 'incorrecta'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  // FT-03: Acceso denegado por rol
  test('FT-03: Un usuario normal no debe poder listar usuarios', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', tokenUser);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Acceso denegado');
  });

  // FT-04: Correo obligatorio
  test('FT-04: No debe registrar un usuario sin correo electrónico', async () => {
    const response = await request(app)
      .post('/api/users/create')
      .send({
        name: 'Sin',
        lastname: 'Correo',
        password: PASSWORD
      });

    expect(response.status).toBe(501);
    expect(response.body.success).toBe(false);
  });

  // FT-05: Actualización parcial
  test('FT-05: Debe actualizar el teléfono sin modificar otros datos', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', tokenAdmin)
      .send({
        phone: '3000000000'
      });

    expect(response.status).toBe(200);

    const user = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE id = ?',
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows[0]);
        }
      );
    });

    expect(user.phone).toBe('3000000000');
    expect(user.name).toBe('User');
    expect(user.email).toBe(USER_EMAIL);
  });

  // Limpiar solamente los usuarios creados por estas pruebas
  afterAll(async () => {
    await new Promise((resolve) => {
      db.query(
        'DELETE FROM users WHERE id IN (?, ?)',
        [adminId || 0, userId || 0],
        () => resolve()
      );
    });

    await new Promise((resolve) => db.end(resolve));
  });
});
