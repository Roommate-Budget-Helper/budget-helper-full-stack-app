import { xorBy } from "cypress/types/lodash";
import { generateUsername } from "unique-username-generator";

describe('Home CRUD Test', () => {
      beforeEach(() => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[name=username]').type("userForTesting2");
        cy.get('input[name=password]').type("123Test!");
        cy.get('button[type=submit]').click();
        cy.contains('"authenticated"');
        cy.visit('http://localhost:3000/homes');
      });

      it('Title exists', () => {
        cy.contains("Welcome to Roomate Budget Helper 👋");
      });

      const homeName = generateUsername();
      //give an image
      const image = "/images/logo.png";
      const address = generateUsername();
      it('Can generate a new Home', () => {
        // cy.get('div > #createHome').click();
        cy.visit('http://localhost:3000/createhome');
        cy.get('input[name=image]').attachFile(image);
        cy.get('input[name=name]').type(homeName);
        cy.get('input[name=address]').type(address);
        cy.get('button[type=submit]').click();
        cy.contains(homeName);
      });

      const homeCheck = "div > #" + homeName;

      it('Can view the created home', () => {
        cy.get("div > #Home").wait(500).click();
        cy.get(homeCheck).click();
        cy.contains(homeName);
        cy.contains(address);
      });

    });