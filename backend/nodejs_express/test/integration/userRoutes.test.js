
jest.mock("../../models/user", () => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
}));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../server");
const User = require("../../models/user");
const keys = require("../../config/keys");

describe("Pruebas de integración de las rutas de usuarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TI-01: Registrar un usuario
  test("TI-01: debe registrar un usuario correctamente", async () => {
    User.create.mockImplementation((user, callback) => {
      callback(null, { id: 1, ...user });
    });

    const response = await request(app)
      .post("/api/users/create")
      .send({
        name: "Usuario",
        lastname: "Prueba",
        email: "integracion@test.com",
        password: "Clave123",
        phone: "3001234567",
        role: "user",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Usuario creado correctamente");
    expect(User.create).toHaveBeenCalled();
  });

  // TI-02: Rechazar inicio de sesión con correo inexistente
  test("TI-02: debe rechazar un correo que no existe", async () => {
    User.findByEmail.mockImplementation((email, callback) => {
      callback(null, null);
    });

    const response = await request(app)
      .post("/api/users/login")
      .send({
        email: "inexistente@test.com",
        password: "Clave123",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(User.findByEmail).toHaveBeenCalled();
  });

  // TI-03: Bloquear acceso sin token
  test("TI-03: debe bloquear el listado de usuarios sin token", async () => {
    const response = await request(app)
      .get("/api/users");

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(User.findAll).not.toHaveBeenCalled();
  });

  // TI-04: Permitir listar usuarios con token de administrador
  test("TI-04: debe permitir listar usuarios con token de admin", async () => {
    User.findAll.mockImplementation((callback) => {
      callback(null, [
        {
          id: 1,
          name: "Usuario",
          email: "usuario@test.com",
          role: "user",
        },
      ]);
    });

    const token = jwt.sign(
      { id: 1, role: "admin" },
      keys.secretOrKey,
      { expiresIn: "1h" }
    );

    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(User.findAll).toHaveBeenCalled();
  });

  // TI-05: Consultar un usuario que no existe
  test("TI-05: debe responder 404 si el usuario no existe", async () => {
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
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Usuario no encontrado");
  });
});
