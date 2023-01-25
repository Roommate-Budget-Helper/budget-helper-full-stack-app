import { generateUsername } from "unique-username-generator";
describe('Login and Registration Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });
  
  it('Title exists', () => {
    cy.contains("Welcome Back 👋");
  });

  it('Subtitle exits', () => {
    cy.contains("We are excited to have you back but to get started please login!");
  });
  const password = "Abc@12345";
  const username = generateUsername();
  let inboxId;
  let emailAddress;
  it('can generate a new email address and sign up', () => {
    // see commands.js custom commands
    cy.createInbox().then(inbox => {
      // verify a new inbox was created
      assert.isDefined(inbox)

      // save the inboxId for later checking the emails
      inboxId = inbox.id
      emailAddress = inbox.emailAddress;
      cy.contains('Sign Up').click();
      // sign up with inbox email address and the password
      cy.get('input[name=email]').type(emailAddress);
      cy.get('input[name=password]').type(password);
      cy.get('input[name=confirmPassword]').type(password);
      cy.get('input[name=username]').type(username);
      cy.get('button[type=submit]').click();
      cy.waitForEmail(inboxId).then(email => {
        assert.isDefined(email);
        assert.strictEqual(/Your verification code is/.test(email.body), true);
        const code = email.body.match(/\d+/)[0];
        cy.get('input[name=verification-code]').type(`${code}{enter}`)
        cy.wait(600);
      })
    });
  });
  
  it('Can log in with registered user', () => {
    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('button[type=submit]').click();
    cy.contains("authenticated");
  })
});