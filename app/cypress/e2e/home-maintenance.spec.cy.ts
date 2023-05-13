import { generateUsername } from "unique-username-generator";

describe("Home Maintenance Test", () => {
    const usernameForTest = generateUsername();
    const password = "123Test!";
    const homeName = generateUsername();
    //give an image
    const image = "/images/logo.png";
    const address = generateUsername();
    const homeCheck = "div > #" + homeName;

    // Register once, Login each test
    before(() => {
        cy.visit("http://localhost:3000/login");
        cy.register(usernameForTest, password);
        cy.createAHome(image, homeName, address);
        cy.signoutOfApplication();
    });

    beforeEach(() => {
        cy.visit("http://localhost:3000/");
        cy.login(usernameForTest, password);
        cy.visit("http://localhost:3000/homes");
    });

    afterEach(() => {
        cy.signoutOfApplication();
    });

    // Test Home Page

    it("Title exists", () => {
        cy.viewAHome(homeCheck, homeName, address);
        cy.contains(homeName);
        cy.contains(address);
    });

    it("Will pull up the home maintenence tab", () => {
        cy.viewAHome(homeCheck, homeName, address);
        cy.get("div > #drop-down").click();
        cy.contains("Leave Home")
    });

    // Test 
    const fakeInviteEmail = "fakeEmail@gmail.com";

    it("Can invite a roommate", () => {
        cy.inviteARoommate(homeCheck, homeName, address, fakeInviteEmail);
    });

    it("Can not invite a roommate twice", () => {
        cy.inviteARoommate(homeCheck, homeName, address, fakeInviteEmail);
        cy.wait(500).contains("The invite failed. Make sure the user is not already invited to the home, in the home or that you did not invite yourself!");
    });

    it("Can not invite a non email", () => {
        cy.inviteARoommate(homeCheck, homeName, address, "guts");
        cy.contains("This is not a valid email!");
    });

    it("Can not update your own permissions", () => {
        cy.viewAHome(homeCheck, homeName, address);
        cy.get("div > #drop-down").click();
        cy.get("div > #owner").click();
        cy.get("button[type=submit]").click();
        cy.contains("You cannot change your own Permissions!");
    });

    const homeName2 = generateUsername();
    //give an image
    const address2 = generateUsername();
    const homeCheck2 = "div > #" + homeName2;

    it("Can update home", () => {
        cy.viewAHome(homeCheck, homeName, address);
        cy.get("div > #drop-down").click();
        cy.get("div > #edit").click();
        cy.get("input[name=name]").clear();
        cy.get("input[name=address]").clear();
        cy.get("input[name=image]").attachFile(image);
        cy.get("input[name=name]").type(homeName2);
        cy.get("input[name=address]").type(address2);
        cy.get("button[type=submit]").click();
        cy.wait(500).contains(homeName2);
        cy.contains(address2);
    });

    it("Can not update home with empty string", () => {
        cy.viewAHome(homeCheck2, homeName2, address2);
        cy.get("div > #drop-down").click();
        cy.get("div > #edit").click();
        cy.get("input[name=name]").clear();
        cy.get("input[name=address]").clear();
        cy.get("button[type=submit]").click();
        cy.contains("The home must have a name, it cannot be empty.");
    });

    it("Can not update home with long string", () => {
        cy.viewAHome(homeCheck2, homeName2, address2);
        cy.get("div > #drop-down").click();
        cy.get("div > #edit").click();
        cy.get("input[name=image").attachFile(image);
        cy.get("input[name=name]").type("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
        cy.get("input[name=address]").type(address2);
        cy.get("button[type=submit]").click();
        cy.contains("The home name must be short, it cannot be greater than 32 characters.");
    });

    it("Can not leave home as only owner", () => {
        cy.viewAHome(homeCheck2, homeName2, address2);
        cy.get("div > #drop-down").click();
        cy.get("div > #leave").click();
        cy.contains("Are you sure you want to leave this home? Leaving will remove yourself from this home, and cannot be undone without another user to invite you back.");
        cy.get("button[value=Leave]").click();
        cy.wait(500).contains(homeName2);
        cy.contains(address2);
    });

    it("Can delete home", () => {
        cy.viewAHome(homeCheck2, homeName2, address2);
        cy.get("div > #drop-down").click();
        cy.get("div > #delete").click();
        cy.contains("Are you sure you want to delete this home? Deleting will remove this home for all occupants, and cannot be undone.");
        cy.get("button[value='Delete Permanently']").click();
        cy.contains("Welcome to Roomate Budget Helper 👋");
    });

});
