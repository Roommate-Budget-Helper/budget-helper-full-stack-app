import { generateUsername } from "unique-username-generator";

const successUsername = generateUsername();
const successPassword = "Abc@12345";

describe("User Tests", () => {
    before(() => {
        cy.visit("http://localhost:3000/register");
        cy.register(successUsername, successPassword);
        cy.signoutOfApplication();
    });

    beforeEach(() => {
        cy.login(successUsername, successPassword);
        cy.visit("http://localhost:3000/user");
    });

    afterEach(() => {
        cy.signoutOfApplication();
    });

    it("Title exists", () => {
        cy.contains("Settings");
    });

    // TODO: Add waits to get the payment methods
    it("Set payment method", () => {
        const paymentMethod1 = "https://venmo.com/?txn=pay&audience=friends";
        cy.get("input[name=paymentMethod1]").type(paymentMethod1);
        cy.get("button[value='Update Payment']").click();
        cy.reload();
        cy.get("input[name=paymentMethod1]").should(
            "have.value",
            paymentMethod1
        );
    });

    it("Upload image, successful PNG", () => {
        cy.fixture("sample_profile_picture_success.png").then((fileContent) => {
            cy.get('input[name="image"]').attachFile({
                fileContent: fileContent.toString(),
                fileName: "sample_profile_picture_success.png",
                mimeType: "image/png",
            });
        });
        cy.get("button[value=Upload]").click();
    });

    it("Upload image, successful JPG", () => {
        cy.fixture("sample_profile_picture_success.jpg").then((fileContent) => {
            cy.get('input[name="image"]').attachFile({
                fileContent: fileContent.toString(),
                fileName: "sample_profile_picture_success.jpg",
                mimeType: "image/jpg",
            });
        });
        cy.get("button[value=Upload]").click();
    });

    it("Upload image, image too big", () => {
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
