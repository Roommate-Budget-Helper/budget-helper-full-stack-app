import { generateUsername } from "unique-username-generator";

const successUsername = generateUsername();
const successPassword = "Abc@12345";
let successInboxId:string;
let successVerificationCode:string;

export const loginUser = (username, password) => {
  cy.visit('http://localhost:3000/login');
  cy.get('input[name=username]').type(username);
  cy.get('input[name=password]').type(password);
  cy.get('button[type=submit]').click();
  cy.url().should('contain', '/homes');
};

export const registerUser = (username, password) => {
  cy.visit('http://localhost:3000/login');
  cy.contains("Sign Up").click();
  let emailAddress: string;
  // see commands.js custom commands
  cy.createInbox().then(inbox => {
    // verify a new inbox was created
    assert.isDefined(inbox)

    // save the inboxId for later checking the emails
    successInboxId = inbox.id
    emailAddress = inbox.emailAddress;

    // sign up with inbox email address and the password
    cy.get('input[name=email]').type(emailAddress);
    cy.get('input[name=password]').type(password);
    cy.get('input[name=confirmPassword]').type(password);
    cy.get('input[name=username]').type(username);
    cy.get('button[type=submit]').click();

    cy.waitForEmail(successInboxId).then(email => {
      successInboxId = inbox.id
      assert.isDefined(email);
      assert.strictEqual(/Your (confirmation|verification) code is/.test(email.body), true);
      const code = email.body.match(/\d+/)[0];
      successVerificationCode = code;
      cy.get('input[name=verification-code]').type(`${code}{enter}`)
      cy.wait(600);
    })
  });
}

describe('Registration Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('Title exists', () => {
    cy.contains("Welcome 👋");
  });

  it('Subtitle exits', () => {
    cy.contains("Welcome to Roommate Budget Helper, your friendly budgeting application");
  });


  // Success flow for registration
  it('can generate a new email address and sign up', () => {
    registerUser(successUsername, successPassword);
  });

  it('can throw an error when false verification code sign up', () => {
    const username = generateUsername();
    const password = "Abc@12345";
    let inboxId: string;
    let emailAddress: string;

    cy.createInbox().then(inbox => {
      // verify a new inbox was created
      assert.isDefined(inbox)

      // save the inboxId for later checking the emails
      inboxId = inbox.id
      emailAddress = inbox.emailAddress;

      // sign up with inbox email address and the password
      cy.get('input[name=email]').type(emailAddress);
      cy.get('input[name=password]').type(password);
      cy.get('input[name=confirmPassword]').type(password);
      cy.get('input[name=username]').type(username);
      cy.get('button[type=submit]').click();

      cy.waitForEmail(inboxId).then(email => {
        assert.isDefined(email);
        assert.strictEqual(/Your (confirmation|verification) code is/.test(email.body), true);
        const code = '123456';
        cy.get('input[name=verification-code]').type(`${code}{enter}`)
        cy.wait(600);
      })
      cy.contains('Something went wrong! Invalid verification code provided, please try again.');
    });
  });

  it('can fail to register with an existing username', () => {
    cy.contains('Sign Up').click();
    cy.get('input[name=username]').type(successUsername);
    cy.get('input[name=email]').type("test@email.com");
    cy.get('input[name=password]').type(successPassword);
    cy.get('input[name=confirmPassword]').type(successPassword);
    cy.get('button[type=submit]').click();
    cy.contains('Something went wrong! User already exists');
  });

});

describe('Login Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });
  
  it('Title exists', () => {
    cy.contains("Welcome Back 👋");
  });

  it('Subtitle exists', () => {
    cy.contains("We are excited to have you back but to get started please login!");
  });

  // Success flow for login
  it('Can log in with registered user', () => {
    loginUser(successUsername, successPassword)
  });

  it('Can throw error on not existing username', () => {
    cy.get('input[name=username]').type("fakeUsername");
    cy.get('input[name=password]').type(successPassword);
    cy.get('button[type=submit]').click();
    cy.contains('Invalid Login Details Provided. Please try again!');
  });

  it('Can throw error on incorrect password', () => {
    cy.get('input[name=username]').type(successUsername);
    cy.get('input[name=password]').type("fakePassword");
    cy.get('button[type=submit]').click();
    cy.contains('Invalid Login Details Provided. Please try again!');
  });
});

describe('Forgot Password test', () => {
  const newPassword = "1234Password!";
  beforeEach(() => {
    cy.visit('http://localhost:3000/forgot_password');
  });

  it('Title exists', () => {
    cy.contains('Forgot Password?');
  });

  it('Subtitle exists', () => {
    cy.contains('Forgot your password? No worries, we can help you out!');
  });

/*
  it('Can change password', () => {
    cy.get('input[name=username]').type(successUsername);
    cy.get('button[type=submit').click();

    cy.wait(600);
    cy.waitForEmail(successInboxId).then(email => {
      assert.isDefined(email);
      assert.strictEqual(/Your (confirmation|verification) code is/.test(email.body), true);
      const code = email.body.match(/\d+/)[0];
      cy.get('input[name=verification-code]').type(code);
      cy.get('input[name=new-password]').type(newPassword);
      cy.get('button[type=submit]').click();
      cy.wait(600);
      cy.url().should('contain', '/homes');
    });
  });

  it('Can login with new password', () => {
    loginUser(successUsername, newPassword);
  });
  */

  it('can throw an error when false verification code forgot password', () => {
    cy.get('input[name=username]').type(successUsername);
    cy.get('button[type=submit').click();

    cy.waitForEmail(successInboxId).then(email => {
      assert.isDefined(email);
      assert.strictEqual(/Your (confirmation|verification) code is/.test(email.body), true);
      const code = '123456';
      cy.get('input[name=verification-code]').type(code);
      cy.get('input[name=new-password]').type(newPassword);
      cy.get('button[type=submit]').click();
      cy.wait(600);
    })
      cy.contains('Something went wrong! Invalid verification code provided, please try again.');
    });
    
});

