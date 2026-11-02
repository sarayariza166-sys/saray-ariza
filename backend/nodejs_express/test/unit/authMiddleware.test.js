
const { verifyToken } = require("../../middlewares/authMiddleware");

describe("Pruebas unitarias del middleware de autenticación", () => {
  test("UT-03: debe rechazar una solicitud cuando no se envía token", () => {
    const req = {
      headers: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "No se proporcionó un token",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
