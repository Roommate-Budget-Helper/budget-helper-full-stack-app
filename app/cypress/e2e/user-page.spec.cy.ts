import { generateUsername } from "unique-username-generator";

const successUsername = generateUsername();
const successPassword = "Abc@12345";

describe("User Tests", () => {
   it("User Management", () => {
        cy.register(successUsername, successPassword);
        cy.login(successUsername, successPassword);
        cy.visit("http://localhost:3000/user");
        cy.contains("Settings");
        const paymentMethod1 = "https://venmo.com/?txn=pay&audience=friends";
        cy.get("input[name=paymentMethod1]").type(paymentMethod1);
        cy.get("button[value='Update Payment']").click();
        cy.reload();
        cy.get("input[name=paymentMethod1]").should(
            "have.value",
            paymentMethod1
        );
        cy.fixture("sample_profile_picture_success.png").then((fileContent) => {
            cy.get('input[name="image"]').attachFile({
                fileContent: fileContent.toString(),
                fileName: "sample_profile_picture_success.png",
                mimeType: "image/png",
            });
        });
        cy.get("button[value=Upload]").click();
        cy.wait(500);
        cy.reload();
        cy.fixture("sample_profile_picture_success.jpg").then((fileContent) => {
            cy.get('input[name="image"]').attachFile({
                fileContent: fileContent.toString(),
                fileName: "sample_profile_picture_success.jpg",
                mimeType: "image/jpg",
            });
        });
        cy.get("button[value=Upload]").click();
        cy.wait(500);
        cy.reload();
        cy.fixture("sample_profile_picture_image_too_large.jpg").then(
            (fileContent) => {
                cy.get('input[name="image"]').attachFile({
                    fileContent: fileContent.toString(),
                    fileName: "sample_profile_picture_image_too_large.jpg",
                    mimeType: "image/jpg",
                });
            }
        );
        cy.get("button[value=Upload]").click();
        cy.contains("The image file is too large, it must be less than 1MB.");
    });
});
