import { generateUsername } from "unique-username-generator";
import { loginUser, registerUser } from "./login-registration.spec.cy";

// TODO: Put a tag on the error messages so we can check if there are the proper error messages being displayed.
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
        loginUser(usernameForTest, password);
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

    // TODO: Add more navbar tests from the home page

    // Test create home page

    const homeName = generateUsername();
    //give an image
    const image = "/images/logo.png";
    const address = generateUsername();

    it("Can generate a new Home", () => {
        // cy.get('div > #createHome').click();
        cy.visit("http://localhost:3000/createhome");
        cy.get("input[name=image]").attachFile(image);
        cy.get("input[name=name]").type(homeName);
        cy.get("input[name=address]").type(address);
        cy.get("button[type=submit]").click();
        cy.contains(homeName);
    });

    const homeCheck = "div > #" + homeName;

    it("Can view the created home", () => {
        cy.get("div > #Home").wait(500).click();
        cy.get(homeCheck).click();
        cy.contains(homeName);
        cy.contains(address);
    });

    it('Will allow creation of multiple homes', () => {
      const homeName2 = generateUsername();
      //give an image
      const image2 = "/images/logo.png";
      const address2 = generateUsername();

      cy.visit("http://localhost:3000/createhome");
      cy.get("input[name=image]").attachFile(image2);
      cy.get("input[name=name]").type(homeName2);
      cy.get("input[name=address]").type(address2);
      cy.get("button[type=submit]").click();

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

      // Check if we get an error. If so, test passes

    });

    it("Will fail creation on no image input", () => {
      const homeName2 = generateUsername();
      const address2 = generateUsername();
      
      cy.visit("http://localhost:3000/createhome");
      cy.get("input[name=name]").type(homeName2);
      cy.get("input[name=address]").type(address2);
      cy.get("button[type=submit]").click();

      // Check if we get an error. If so, test passes

    });

    it("Will fail creation on no text inputs", () => {
      cy.visit("http://localhost:3000/createhome");
      cy.get("input[name=name]").type("");
      cy.get("input[name=address]").type("");
      cy.get("button[type=submit]").click();

      // Check if we get an error. If so, test passes

    });

    it('Will fail creation when creating duplicate homes', () => {
        const homeName2 = generateUsername();
        const image2 = "/images/logo.png";
        const address2 = generateUsername();

        cy.visit("http://localhost:3000/createhome");
        cy.get("input[name=image]").attachFile(image2);
        cy.get("input[name=name]").type(homeName2);
        cy.get("input[name=address]").type(address2);
        cy.get("button[type=submit]").click();
        cy.contains(homeName2);

        // create a second home with the same info
        cy.visit("http://localhost:3000/createhome");
        cy.get("input[name=image]").attachFile(image2);
        cy.get("input[name=name]").type(homeName2);
        cy.get("input[name=address]").type(address2);
        cy.get("button[type=submit]").click();
        cy.contains(homeName2);

        // Check if we get an error. If so, test passes

    });

});
