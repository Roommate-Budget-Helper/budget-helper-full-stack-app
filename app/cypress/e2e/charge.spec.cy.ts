import { generateUsername } from "unique-username-generator";

const successUsername = generateUsername();
const successUsername2 = generateUsername();
const successPassword = "Abc@12345";
const homeName = generateUsername();
//give an image
const image = "/images/logo.png";
const address = generateUsername();
const homeCheck = "div > #" + homeName;

const acceptsInviteIntoHome = (userName, password, homeName) => {
    cy.login(userName, password);
    cy.visit("http://localhost:3000/notifications");
    cy.contains(homeName);
    cy.get("button[value=Accept]").click();
    cy.visit("http://localhost:3000/homes");
    cy.wait(500).contains(homeName);
};

describe('Charge Test', () => {
  const chargeDescription = generateUsername();
    const chargeCategory = generateUsername();
    const cost = "35";
    const date = new Date().toISOString().split("T")[0];
    it("Create Users and Home", () => {
        cy.register(successUsername, successPassword);
        cy.visit("http://localhost:3000/login");
        cy.contains("Sign Up").click();
        let emailAddress: string;
        cy.createInbox().then(inbox => {
            assert.isDefined(inbox)
            const successInboxId = inbox.id
            emailAddress = inbox.emailAddress;
            cy.get('input[name=email]').type(emailAddress);
            cy.get('input[name=password]').type(successPassword);
            cy.get('input[name=confirmPassword]').type(successPassword);
            cy.get('input[name=username]').type(successUsername2);
            cy.get('button[type=submit]').click();

            cy.waitForEmail(successInboxId).then(email => {
            assert.isDefined(email);
            assert.strictEqual(/Your (confirmation|verification) code is/.test(email.body), true);
            const code = email.body.match(/\d+/)[0];
            cy.get('input[name=verification-code]').type(`${code}{enter}`)
            cy.get('#createHome');
            cy.signoutOfApplication();
            cy.login(successUsername, successPassword);
            cy.createAHome(image, homeName, address);
            cy.inviteARoommate(homeCheck, homeName, address, emailAddress);
            })
        });
        cy.signoutOfApplication();
        acceptsInviteIntoHome(successUsername2, successPassword, homeName);
        cy.signoutOfApplication();
    });
    it("Charges", () => {
        cy.login(successUsername, successPassword);
        cy.viewAHome(homeCheck, homeName, address);
        cy.visit("http://localhost:3000/billing");
        cy.contains("Billing");
        cy.get("button[value='Send Charge']").click();
        cy.contains("Create Charge");
        cy.get("input[name=amount]").type(cost);
        cy.get("input[name=name]").type(chargeDescription);
        cy.get("input[name=category]").type(chargeCategory);
        cy.get("button[type=submit]").click();
        cy.contains("You must have exactly one occupant as payer for a charge.");
        cy.reload()
        cy.get("input[name=amount]").type(cost);
        cy.get("input[name=category]").type(chargeCategory);
        cy.get("button[type=submit]").click();
        cy.contains("The charge must have a name, it cannot be empty.");
        cy.reload();
        cy.get("input[name=amount]").type("0");
        cy.get("input[name=name]").type(chargeDescription);
        cy.get("input[name=category]").type(chargeCategory);
        cy.get("button[type=submit]").click();
        cy.contains("The bill amount must be greater than 0.01");
        cy.reload();
        cy.get("input[name=amount]").type(cost);
        cy.get("input[name=name]").type(chargeDescription);
        cy.get("input[name=category]").type(chargeCategory);
        cy.get("input[name=dueDate]").type(date);
        cy.get("input[id=" + successUsername + "]").click();
        cy.get("button[type=submit]").click();

        cy.contains("Splitting $35");
        cy.get("input[name=" + successUsername2 + "]").type("35");
        cy.get("button[value='Send Charge']").click();
        cy.wait(300);
        cy.signoutOfApplication();
    });
    it("Pay Charge", () => {
        cy.login(successUsername2, successPassword);
        cy.viewAHome(homeCheck, homeName, address);
        cy.visit("http://localhost:3000/billing");
        cy.wait(500).contains("Charger: ");
        cy.contains("Amount Before Splitting: $");
        cy.contains("Description: ");
        cy.get("button[value='Send Payment']").click();
        cy.wait(300);
        cy.signoutOfApplication();
    });
    it("Verify Charge", () => {
        cy.login(successUsername, successPassword);
        cy.viewAHome(homeCheck, homeName, address);
        cy.visit("http://localhost:3000/billing");
        cy.wait(500).contains("Date Paid:");
        cy.contains("Amount Paid: $");
        cy.get("button[value='Confirm Payment']").click();
        cy.wait(500).contains("You have no charges pending approval.");
        cy.viewAHome(homeCheck, homeName, address);
        cy.visit("http://localhost:3000/history");
        cy.wait(500).contains("Charge History");
        cy.contains("you charged");
        cy.contains("✅ Confirmed");
        cy.contains("⭐ Total Amount: $");
    })
});