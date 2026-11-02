
jest.mock("../../config/config", () => ({
  query: jest.fn(),
}));

const db = require("../../config/config");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

describe("Pruebas unitarias del modelo User", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("UT-04: debe cifrar la contraseña antes de guardarla", async () => {
    db.query.mockImplementation((sql, values, callback) => {
      callback(null, { insertId: 1 });
    });

    const user = {
      name: "Usuario",
      lastname: "Prueba",
      email: "prueba@test.com",
      password: "ClavePrueba123",
      phone: "3001234567",
      image: "",
      role: "user",
    };

    const resultado = jest.fn();

    await User.create(user, resultado);

    const valoresGuardados = db.query.mock.calls[0][1];
    const contrasenaCifrada = valoresGuardados[3];

    expect(contrasenaCifrada).not.toBe(user.password);

    const coincide = await bcrypt.compare(
      user.password,
      contrasenaCifrada
    );

    expect(coincide).toBe(true);
    expect(resultado).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ id: 1 })
    );
  });
});
