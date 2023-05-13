// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
/* eslint-disable @typescript-eslint/no-explicit-any */

// Import commands.js using ES2015 syntax:
import "./commands";
import { MailSlurp } from "mailslurp-client";

// Alternatively you can use CommonJS syntax:
// require('./commands')
const apiKey = Cypress.env("API_KEY");
const mailslurp = new MailSlurp({ apiKey });


Cypress.Commands.add("createInbox", () => {
    return mailslurp.createInbox();
});

Cypress.Commands.add("waitForEmail", (inboxId: string) => {
    const timeout = 30000;
    return mailslurp.waitForLatestEmail(inboxId, timeout);
});

Cypress.Commands.add("deleteEmail", (emailId: string) => {
       return mailslurp.deleteEmail(emailId);
   });

Cypress.Commands.add("login", (username: string, password: string) => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('button[type=submit]').click();
    cy.wait(500).url().should('contain', '/homes');
})

Cypress.Commands.add("createAHome", (image: string, homeName: string, address: string) => {
    cy.visit("http://localhost:3000/createhome");
    cy.get("input[name=image]").attachFile(image);
    cy.get("input[name=name]").type(homeName);
    cy.get("input[name=address]").type(address);
    cy.get("button[type=submit]").click();
    cy.contains(homeName);
})

Cypress.Commands.add("viewAHome", (homeCheck: string, homeName: string, address: string) => {
    cy.get("div > #Home").wait(500).click();
    cy.get(homeCheck).click();
    cy.contains(homeName);
    cy.contains(address);
})

Cypress.Commands.add("inviteARoommate", (homeCheck: string, homeName: string, address: string, inviteEmail: string) => {
    cy.viewAHome(homeCheck, homeName, address);
    cy.get("div > #drop-down").click();
    cy.get("div > #invite").click();
    cy.get("input[name=email]").type(inviteEmail);
    cy.get("button[type=submit]").click();
})

Cypress.Commands.add("signoutOfApplication", () => {
    cy.visit("http://localhost:3000/user");
    cy.get("button[value='Sign Out']").click();
    cy.contains("Sign Up");
    cy.window().then(win => {
        expect(win.location.pathname).to.equal("/login")
    })
})

Cypress.Commands.add("register", (username: string, password: string) => {
    cy.visit('http://localhost:3000/login');
    cy.contains("Sign Up").click();
    let emailAddress: string;
    // see commands.js custom commands
    cy.createInbox().then(inbox => {
      // verify a new inbox was created
      assert.isDefined(inbox)
  
      // save the inboxId for later checking the emails
      emailAddress = inbox.emailAddress;
  
      // sign up with inbox email address and the password
      cy.get('input[name=email]').type(emailAddress);
      cy.get('input[name=password]').type(password);
      cy.get('input[name=confirmPassword]').type(password);
      cy.get('input[name=username]').type(username);
      cy.get('button[type=submit]').click();
  
      cy.waitForEmail(inbox.id).then(email => {
        assert.isDefined(email);
        assert.strictEqual(/Your (confirmation|verification) code is/.test(email.body), true);
        const code = email.body.match(/\d+/)[0];
        cy.get('input[name=verification-code]').type(`${code}{enter}`)
        cy.wait(600);
      })
    });
})
