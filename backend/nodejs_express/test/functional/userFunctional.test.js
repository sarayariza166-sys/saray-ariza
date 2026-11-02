
jest.mock("../../models/user", () => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
}));

const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../../server");
const User = require("../../models/user");
const keys = require("../../config/keys");

describe("Pruebas funcionales de usuarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // FT-01: Registro con rol predeterminado
  test("FT-01: debe registrar al usuario con rol user por defecto", async () => {
    User.create.mockImplementation((user, callback) => {
      callback(null, { id: 10, ...user });
    });

    const response = await request(app)
      .post("/api/users/create")
      .send({
        name: "Ana",
        lastname: "Prueba",
        email: "ana@test.com",
        password: "Clave123",
        phone: "3001234567",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(User.create.mock.calls[0][0].role).toBe("user");
  });

  // FT-02: Inicio de sesión con contraseña incorrecta
  test("FT-02: debe rechazar una contraseña incorrecta", async () => {
    const hash = await bcrypt.hash("ClaveCorrecta123", 10);

    User.findByEmail.mockImplementation((email, callback) => {
      callback(null, {
        id: 1,
        email: "ana@test.com",
        password: hash,
        role: "user",
      });
    });

    const response = await request(app)
      .post("/api/users/login")
      .send({
        email: "ana@test.com",
        password: "ClaveIncorrecta",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  // FT-03: Inicio de sesión exitoso
  test("FT-03: debe iniciar sesión con credenciales correctas", async () => {
    const hash = await bcrypt.hash("ClaveCorrecta123", 10);

    User.findByEmail.mockImplementation((email, callback) => {
      callback(null, {
        id: 1,
        email: "ana@test.com",
        name: "Ana",
        lastname: "Prueba",
        password: hash,
        role: "user",
      });
    });

    const response = await request(app)
      .post("/api/users/login")
      .send({
        email: "ana@test.com",
        password: "ClaveCorrecta123",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.session_token).toMatch(/^JWT /);
  });

  // FT-04: Acceso denegado a un usuario sin rol autorizado
  test("FT-04: debe impedir que un usuario normal liste usuarios", async () => {
    const token = jwt.sign(
      { id: 2, role: "user" },
      keys.secretOrKey,
      { expiresIn: "1h" }
    );

    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(User.findAll).not.toHaveBeenCalled();
  });

  // FT-05: Consulta de usuario inexistente
  test("FT-05: debe informar cuando un usuario no existe", async () => {
    User.findById.mockImplementation((id, callback) => {
      callback(null, null);
    });

    const token = jwt.sign(
      { id: 1, role: "admin" },
      keys.secretOrKey,
      { expiresIn: "1h" }
    );

    const response = await request(app)
      .get("/api/users/999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });
});
