import { generateUsername } from "unique-username-generator";
import { loginUser, registerUser } from "./login-registration.spec.cy";
import { createAHome, viewAHome } from "./home-CRUD.spec.cy";

describe("Home Maintenance Test", () => {
    const usernameForTest = generateUsername();
    const password = "123Test!";
    let homeName = generateUsername();
    //give an image
    const image = "/images/logo.png";
    let address = generateUsername();
    let homeCheck = "div > #" + homeName;

    // Register once, Login each test
    before(() => {
        cy.visit("http://localhost:3000/login");
        registerUser(usernameForTest, password);
        cy.visit("http://localhost:3000/login");
        loginUser(usernameForTest, password);
        createAHome(image, homeName, address);
    });

    beforeEach(() => {
        cy.visit("http://localhost:3000/login");
        loginUser(usernameForTest, password);
        cy.visit("http://localhost:3000/homes");
    });

    // Test Home Page

    it("Title exists", () => {
        viewAHome(homeCheck, homeName, address);
        cy.contains(homeName);
        cy.contains(address);
    });

    it("Will pull up the home maintenence tab", () => {
        viewAHome(homeCheck, homeName, address);
        cy.get("div > #drop-down").click();
        cy.contains("Leave Home")
    });

    // Test 
    const fakeInviteEmail = "fakeEmail@gmail.com";

    it("Can invite a roommate", () => {
        viewAHome(homeCheck, homeName, address);
        cy.get("div > #drop-down").click();
        cy.get("div > #invite").click();
        cy.get("input[name=email]").type(fakeInviteEmail);
        cy.get("button[type=submit]").click();
    });

    it("Can not invite a roommate twice", () => {
        viewAHome(homeCheck, homeName, address);
        cy.get("div > #drop-down").click();
        cy.get("div > #invite").click();
        cy.get("input[name=email]").type(fakeInviteEmail);
        cy.get("button[type=submit]").click();
        cy.wait(500).contains("The invite failed. Make sure the user is not already invited to the home, in the home or that you did not invite yourself!");
    });

    it("Can not invite a non email", () => {
        viewAHome(homeCheck, homeName, address);
        cy.get("div > #drop-down").click();
        cy.get("div > #invite").click();
        cy.get("input[name=email]").type("guts");
        cy.get("button[type=submit]").click();
        cy.contains("This is not a valid email!");
    });

    it("Can not update your own permissions", () => {
        viewAHome(homeCheck, homeName, address);
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
        viewAHome(homeCheck, homeName, address);
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
        viewAHome(homeCheck2, homeName2, address2);
        cy.get("div > #drop-down").click();
        cy.get("div > #edit").click();
        cy.get("input[name=name]").clear();
        cy.get("input[name=address]").clear();
        cy.get("button[type=submit]").click();
        cy.contains("The home must have a name, it cannot be empty.");
    });

    it("Can not update home with long string", () => {
        viewAHome(homeCheck2, homeName2, address2);
        cy.get("div > #drop-down").click();
        cy.get("div > #edit").click();
        cy.get("input[name=image").attachFile(image);
        cy.get("input[name=name]").type("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
        cy.get("input[name=address]").type(address2);
        cy.get("button[type=submit]").click();
        cy.contains("The home name must be short, it cannot be greater than 32 characters.");
    });

    it("Can not leave home as only owner", () => {
        viewAHome(homeCheck2, homeName2, address2);
        cy.get("div > #drop-down").click();
        cy.get("div > #leave").click();
        cy.contains("Are you sure you want to leave this home? Leaving will remove yourself from this home, and cannot be undone without another user to invite you back.");
        cy.get("button[value=Leave]").click();
        cy.wait(500).contains(homeName2);
        cy.contains(address2);
    });

    it("Can delete home", () => {
        viewAHome(homeCheck2, homeName2, address2);
        cy.get("div > #drop-down").click();
        cy.get("div > #delete").click();
        cy.contains("Are you sure you want to delete this home? Deleting will remove this home for all occupants, and cannot be undone.");
        cy.get("button[value='Delete Permanently']").click();
        cy.contains("Welcome to Roomate Budget Helper 👋");
    });

});
