describe('Pruebas de sistema - Smoke Test', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('SYS-01: Debe cargar correctamente la aplicación', () => {
    cy.get('body').should('be.visible');
  });

  it('SYS-02: La aplicación debe mostrar contenido', () => {
    cy.get('body').should('not.be.empty');
  });

});