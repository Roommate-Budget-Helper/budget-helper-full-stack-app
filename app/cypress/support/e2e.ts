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
       console.log("Email to delete:", emailId);
       return mailslurp.deleteEmail(emailId);
   });

