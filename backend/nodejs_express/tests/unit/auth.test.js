
const { verifyToken } = require('../../middlewares/authMiddleware');
const bcrypt = require('bcryptjs');

// Simulamos jsonwebtoken para no utilizar tokens reales
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn((token, secret, callback) => {
    if (token === 'token_valido_simulado') {
      callback(null, { id: 1, role: 'admin' });
    } else {
      callback(new Error('Token invalido'), null);
    }
  })
}));

describe('Nivel 1: Pruebas Unitarias - Backend', () => {

  // UT-01: Verificar que el middleware rechace peticiones sin token
  test('UT-01: Debe rechazar peticiones sin autorización', () => {
    const req = { headers: {} };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );

    expect(next).not.toHaveBeenCalled();
  });

  // UT-02: Verificar que rechace tokens inválidos
  test('UT-02: Debe rechazar un token inválido', () => {
    const req = {
      headers: {
        authorization: 'Bearer token_invalido'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // UT-03: Verificar que permita un token válido
  test('UT-03: Debe permitir continuar cuando el token es válido', () => {
    const req = {
      headers: {
        authorization: 'Bearer token_valido_simulado'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    verifyToken(req, res, next);

    expect(req.user).toEqual({
      id: 1,
      role: 'admin'
    });

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  // UT-04: Verificar que bcrypt encripte las contraseñas
  test('UT-04: bcrypt debe encriptar la contraseña', async () => {
    const password = 'miPassword123';

    const hash = await bcrypt.hash(password, 10);

    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$2[aby]\$.{56}$/);
  });

  // UT-05: Verificar la comparación de contraseñas
  test('UT-05: bcrypt debe validar correctamente las contraseñas', async () => {
    const password = 'miPassword123';

    const hash = await bcrypt.hash(password, 10);

    const correcta = await bcrypt.compare(password, hash);
    const incorrecta = await bcrypt.compare('otraPassword', hash);

    expect(correcta).toBe(true);
    expect(incorrecta).toBe(false);
  });

});
