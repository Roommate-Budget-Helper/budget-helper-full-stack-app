import { generateUsername } from "unique-username-generator";

describe("Home CRUD Test", () => {
    const usernameForTest = generateUsername();
    const password = "123Test!";

    // Register once, Login each test
    before(() => {
        cy.register(usernameForTest, password);
    });


    // Test Home Page
    const homeName = generateUsername();
    //give an image
    const image = "/images/logo.png";
    const address = generateUsername();
    const homeCheck = "div > #" + homeName;
    it("Home Crud", () => {
        cy.login(usernameForTest, password);
        cy.visit("http://localhost:3000/homes");
        cy.contains("Welcome to Roomate Budget Helper 👋");
        cy.contains("You do not currently belong to any homes...");
        cy.get("#createHome").click();
        cy.wait(600);
        cy.url().should("include", "/createhome");
        cy.createAHome(image,homeName,address);
        cy.viewAHome(homeCheck, homeName, address);
        let homeName2 = generateUsername();
        //give an image
        let image2 = "/images/logo.png";
        let address2 = generateUsername();

        cy.createAHome(image2, homeName2, address2);

        homeName2 = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
      //give an image
        image2 = "/images/logo.png";
        address2 = generateUsername();

        cy.visit("http://localhost:3000/createhome");
        cy.get("input[name=image]").attachFile(image2);
        cy.get("input[name=name]").type(homeName2);
        cy.get("input[name=address]").type(address2);
        cy.get("button[type=submit]").click();

        cy.contains("The home name must be short, it cannot be greater than 32 characters.");


        homeName2 = generateUsername();
        address2 = generateUsername();
        
        cy.visit("http://localhost:3000/createhome");
        cy.get("input[name=name]").type(homeName2);
        cy.get("input[name=address]").type(address2);
        cy.get("button[type=submit]").click();

        cy.wait(500).contains(homeName2);
        cy.visit("http://localhost:3000/createhome");
        cy.get("button[type=submit]").click();

        cy.contains("The home must have a name, it cannot be empty.");
        homeName2 = generateUsername();
        image2 = "/images/logo.png";
        address2 = generateUsername();

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
