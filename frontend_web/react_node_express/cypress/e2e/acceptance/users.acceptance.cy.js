
const usuariosPrueba = [
  {
    id: 1,
    name: 'Oliver',
    lastname: 'Stone',
    email: 'oliver@stone.com',
    role: 'admin',
    phone: '3001234567'
  },
  {
    id: 2,
    name: 'Maria',
    lastname: 'Gomez',
    email: 'maria@example.com',
    role: 'seller',
    phone: '3009876543'
  }
]

// Iniciar sesión con un usuario simulado
const iniciarSesion = (rol = 'admin') => {
  const usuario = rol === 'admin'
    ? usuariosPrueba[0]
    : usuariosPrueba[1]

  cy.intercept('POST', '**/users/login', {
    statusCode: 201,
    body: {
      success: true,
      message: 'Usuario autenticado',
      data: {
        ...usuario,
        session_token: 'JWT token-de-prueba'
      }
    }
  }).as('login')

  cy.intercept('GET', '**/users', {
    statusCode: 200,
    body: {
      success: true,
      message: 'Lista de usuarios',
      data: usuariosPrueba
    }
  }).as('obtenerUsuarios')

  cy.visit('/login')

  cy.get('input[name="email"]')
    .should('be.visible')
    .type(usuario.email)

  cy.get('input[name="password"]')
    .should('be.visible')
    .type('ClaveDePrueba123')

  cy.get('.login-button').click()

  cy.wait('@login')
  cy.url().should('include', '/dashboard')
}

// ST-01: Acceso al módulo de usuarios
describe('ST-01 - Acceso al módulo de usuarios', () => {
  it('Debe permitir acceder al módulo de usuarios', () => {
    iniciarSesion('admin')

    cy.contains('button', 'Usuarios').click()

    cy.contains('h2', 'Gestión de Usuarios')
      .should('be.visible')
  })
})

// ST-02: Consultar listado de usuarios
describe('ST-02 - Listado de usuarios', () => {
  it('Debe mostrar los usuarios registrados', () => {
    iniciarSesion('admin')

    cy.contains('button', 'Usuarios').click()

    cy.wait('@obtenerUsuarios')

    cy.contains('oliver@stone.com').should('be.visible')
    cy.contains('maria@example.com').should('be.visible')
  })
})

// ST-03: Abrir formulario de creación
describe('ST-03 - Crear usuario', () => {
  it('Debe abrir el formulario de nuevo usuario', () => {
    iniciarSesion('admin')

    cy.contains('button', 'Usuarios').click()

    cy.contains('button', 'Nuevo Usuario').click()

    cy.get('.user-form').should('be.visible')
    cy.contains('h3', 'Nuevo Usuario').should('be.visible')
  })
})

// ST-04: Validación del formulario
describe('ST-04 - Validación de usuario', () => {
  it('Debe mostrar un error si las contraseñas no coinciden', () => {
    iniciarSesion('admin')

    cy.contains('button', 'Usuarios').click()
    cy.contains('button', 'Nuevo Usuario').click()

    cy.get('.user-form').should('be.visible')

    cy.get('input[name="name"]').type('Carlos')
    cy.get('input[name="lastname"]').type('Prueba')
    cy.get('input[name="email"]').type('carlos@example.com')
    cy.get('input[name="password"]').type('Clave12345')
    cy.get('input[name="confirmPassword"]').type('OtraClave123')

    cy.get('.user-form button[type="submit"]').click()

    cy.contains('Las contraseñas no coinciden')
      .should('be.visible')
  })
})

// ST-05: Validación de permisos
describe('ST-05 - Permisos de usuarios', () => {
  it('Un vendedor no debe poder eliminar usuarios', () => {
    iniciarSesion('seller')

    cy.contains('button', 'Usuarios').click()

    cy.wait('@obtenerUsuarios')

    cy.get('.users-table tbody tr')
      .should('have.length', 2)

    cy.get('.btn-delete')
      .should('have.length', 2)
      .and('be.disabled')
  })
})
