import { generateUsername } from "unique-username-generator";
import { registerUser } from "./login-registration.spec.cy";

const successUsername = generateUsername();
const successUsername2 = generateUsername();
const successUsername3 = generateUsername();
const successPassword = "Abc@12345";

describe('Charge Test', () => {
    before(() => {
        registerUser(successUsername, successPassword);
        // Signout of user
        registerUser(successUsername2, successPassword);
        // Signout of user
        registerUser(successUsername3, successPassword);
        // Signout of user
    });

    it("Creates a Home", () => {
        // Create a home
        cy.visit('http://localhost:3000/createhome');
    })
});