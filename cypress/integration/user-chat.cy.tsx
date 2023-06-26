describe('A logged in public user can start a chat', () => {
  before(() => {
    cy.cleanUpTestState();
    cy.logInWithEmailAndPassword(Cypress.env('public_email'), Cypress.env('public_password'));
  });

  it('Navigate to the chat page and begin a chat', () => {
    cy.get(`[qa-id=secondary-nav-chat-button]`).should('exist').click(); //go to chat page

    cy.get('button[type="button"]').contains('Start a chat').click(); //click button to start chatting

    cy.get('#crisp-chatbox [data-chat-status="initial"]')
      .should('have.attr', 'data-visible')
      .and('equal', 'true'); //chatbox visible

    cy.get('a[aria-label="Close chat"]').click(); //close chat box
  });

  after(() => {
    cy.logout();
  });
});