import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { render, screen, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import jwtService from '../../services/jwtService';
import AlertMessage from '../../views/common/AlertMessage';

describe('Pruebas unitarias del Frontend', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  // UT-01: Verificar un token vigente
  test('UT-01: debe validar un token que no ha expirado', () => {
    const payload = {
      id: 1,
      email: 'prueba@correo.com',
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const token = jwtService.generateToken(payload);

    expect(jwtService.verifyToken(token)).toBe(true);
  });

  // UT-02: Rechazar un token expirado
  test('UT-02: debe rechazar un token expirado', () => {
    const payload = {
      id: 1,
      email: 'prueba@correo.com',
      exp: Math.floor(Date.now() / 1000) - 600,
    };

    const token = jwtService.generateToken(payload);

    expect(jwtService.verifyToken(token)).toBe(false);
  });

  // UT-05: Mostrar un mensaje de alerta
  test('UT-05: debe mostrar el mensaje de error en pantalla', () => {
    render(
      <AlertMessage
        type="error"
        message="Error al iniciar sesión"
        duration={0}
      />
    );

    expect(
      screen.getByText('Error al iniciar sesión')
    ).toBeInTheDocument();

    expect(
      document.querySelector('.alert-error')
    ).toBeInTheDocument();
  });
});