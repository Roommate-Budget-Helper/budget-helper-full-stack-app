/// <reference types="cypress" />

import { Email, InboxDto } from "mailslurp-client";
import 'cypress-file-upload'

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      createInbox(): Promise<InboxDto>,
      waitForEmail(inboxId: string): Promise<Email>,
      deleteEmail(emailId: string): Promise<void>,
      login(username: string, password: string): Promise<void>,
      register(username: string, password: string): Promise<void>,
      createAHome(image: string, homeName: string, address: string): Promise<void>,
      viewAHome(homeCheck: string, homeName: string, address: string): Promise<void>,
      inviteARoommate(homeCheck: string, homeName: string, address: string, inviteEmail: string): Promise<void>,
      signoutOfApplication(): Promise<void>
    }
  }
}