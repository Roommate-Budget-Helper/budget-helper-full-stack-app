import { xorBy } from "cypress/types/lodash";
import { generateUsername } from "unique-username-generator";

describe('Home CRUD Test', () => {
      beforeEach(() => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[name=username]').type("userForTesting");
        cy.get('input[name=password]').type("123Test!");
        cy.get('button[type=submit]').click();
        cy.contains('"authenticated"');
        cy.visit('http://localhost:3000/homes');
      });

      it('Title exists', () => {
        cy.contains("Welcome to Roomate Budget Helper 👋");
      });

      const homeName = generateUsername();
      const image = generateUsername();
      const address = generateUsername();
      it('Can generate a new Home', () => {
        cy.visit('http://localhost:3000/createhome');
        cy.get('input[name=image]').type(image);
        cy.get('input[name=name]').type(homeName);
        cy.get('input[name=address]').type(address);
        cy.get('button[type=submit]').click();
        cy.contains(homeName);
      });

      it('Can view the created home', () => {
        cy.contains(homeName);
        cy.contains('View ' + homeName).click();
        cy.contains(homeName);
        cy.contains(address);
      });

    });