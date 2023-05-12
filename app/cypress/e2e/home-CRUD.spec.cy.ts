import { generateUsername } from "unique-username-generator";
import { registerUser } from "./login-registration.spec.cy";

describe("Home CRUD Test", () => {
    const usernameForTest = generateUsername();
    const password = "123Test!";

    // Register once, Login each test
    before(() => {
        cy.visit("http://localhost:3000/login");
        registerUser(usernameForTest, password);
    });

    beforeEach(() => {
        cy.visit("http://localhost:3000/login");
        cy.login(usernameForTest, password);
        cy.visit("http://localhost:3000/homes");
    });

    // Test Home Page

    it("Title exists", () => {
        cy.contains("Welcome to Roomate Budget Helper 👋");
    });

    it("Will display there are no homes", () => {
        cy.contains("You do not currently belong to any homes...");
    });

    it("Will redirect to the homes page from navbar", () => {
        cy.get("#createHome").click();
        cy.wait(600);
        cy.url().should("include", "/createhome");
    });

    // Test create home page

    const homeName = generateUsername();
    //give an image
    const image = "/images/logo.png";
    const address = generateUsername();

    it("Can generate a new Home", () => {
        cy.createAHome(image,homeName,address);
    });

    const homeCheck = "div > #" + homeName;

    it("Can view the created home", () => {
        cy.viewAHome(homeCheck, homeName, address);
    });

    it('Will allow creation of multiple homes', () => {
      const homeName2 = generateUsername();
      //give an image
      const image2 = "/images/logo.png";
      const address2 = generateUsername();

      cy.createAHome(image2, homeName2, address2);

    });

    it('Will fail creation on bad home name input', () => {
      // Create long input for home
      const homeName2 = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
      //give an image
      const image2 = "/images/logo.png";
      const address2 = generateUsername();

      cy.visit("http://localhost:3000/createhome");
      cy.get("input[name=image]").attachFile(image2);
      cy.get("input[name=name]").type(homeName2);
      cy.get("input[name=address]").type(address2);
      cy.get("button[type=submit]").click();

      cy.contains("The home name must be short, it cannot be greater than 32 characters.");

    });

    it("Will pass creation on no image input", () => {
      const homeName2 = generateUsername();
      const address2 = generateUsername();
      
      cy.visit("http://localhost:3000/createhome");
      cy.get("input[name=name]").type(homeName2);
      cy.get("input[name=address]").type(address2);
      cy.get("button[type=submit]").click();

      cy.wait(500).contains(homeName2);

    });

    it("Will fail creation on no text inputs", () => {
      cy.visit("http://localhost:3000/createhome");
      cy.get("button[type=submit]").click();

      cy.contains("The home must have a name, it cannot be empty.");

    });

    it('Will fail creation when creating duplicate homes', () => {
        const homeName2 = generateUsername();
        const image2 = "/images/logo.png";
        const address2 = generateUsername();

        cy.createAHome(image2, homeName2, address2);

        // create a second home with the same info
        cy.visit("http://localhost:3000/createhome");
        cy.get("input[name=image]").attachFile(image2);
        cy.get("input[name=name]").type(homeName2);
        cy.get("input[name=address]").type(address2);
        cy.get("button[type=submit]").click();

        cy.contains("You already have a home with these same specs!");

    });

});
