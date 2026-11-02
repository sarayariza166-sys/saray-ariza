
describe('Pruebas de aceptación - Registro de usuarios', () => {

  beforeEach(() => {
    cy.visit('/register')
  })

  it('ACC-01: Debe mostrar el formulario de registro', () => {
    cy.contains('h1', 'Crear Cuenta').should('be.visible')

    cy.get('#name').should('be.visible')
    cy.get('#lastname').should('be.visible')
    cy.get('#email').should('be.visible')
    cy.get('#phone').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#confirmPassword').should('be.visible')
    cy.get('#role').should('be.visible')
  })

  it('ACC-02: Debe mostrar un error cuando las contraseñas no coinciden', () => {
    cy.get('#name').type('Usuario Prueba')
    cy.get('#lastname').type('Apellido Prueba')
    cy.get('#email').type('prueba123@example.com')
    cy.get('#password').type('clave123')
    cy.get('#confirmPassword').type('clave456')

    cy.get('.register-button').click()

    cy.contains('Las contraseñas no coinciden').should('be.visible')
  })

  it('ACC-03: Debe validar la longitud mínima de la contraseña', () => {
    cy.get('#name').type('Usuario Prueba')
    cy.get('#lastname').type('Apellido Prueba')
    cy.get('#email').type('prueba456@example.com')
    cy.get('#password').type('1234')
    cy.get('#confirmPassword').type('1234')

    cy.get('.register-button').click()

    cy.contains('La contraseña debe tener al menos 6 caracteres')
      .should('be.visible')
  })

  it('ACC-04: Debe permitir seleccionar un rol', () => {
    cy.get('#role').select('customer')

    cy.get('#role').should('have.value', 'customer')
  })

 it('ACC-05: Debe permitir navegar al inicio de sesión', () => {
  cy.get('.register-footer a').click()

  cy.url().should('include', '/login')
})

})
