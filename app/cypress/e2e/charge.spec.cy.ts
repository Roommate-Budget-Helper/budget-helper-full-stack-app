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

    before(() => {
        cy.register(successUsername, successPassword);
        // Login second user and connect their email invite!!
        cy.visit('http://localhost:3000/login');
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
            cy.wait(600);
            cy.login(successUsername, successPassword);
            cy.createAHome(image, homeName, address);
            cy.inviteARoommate(homeCheck, homeName, address, emailAddress);
            })
        });
        cy.signoutOfApplication();
    });

    it("User accepts invite to home", () => {
        acceptsInviteIntoHome(successUsername2, successPassword, homeName);
    })

    const chargeDescription = generateUsername();
    const chargeCategory = generateUsername();
    const cost = "35";
    const date = new Date().toISOString().split("T")[0];

    it("User can see charges page", () => {
        cy.login(successUsername, successPassword);
        cy.viewAHome(homeCheck, homeName, address);
        cy.visit("http://localhost:3000/billing");
        cy.contains("Billing");
        cy.get("button[value='Send Charge']").click();
        cy.contains("Create Charge");

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
        cy.login(successUsername2, successPassword);
        cy.viewAHome(homeCheck, homeName, address);
        cy.visit("http://localhost:3000/billing");
        cy.wait(500).contains("Charger: ");
        cy.contains("Amount Before Splitting: $");
        cy.contains("Description: ");
        cy.signoutOfApplication();
    })

    it("User can send a payment", () => {
        cy.login(successUsername2, successPassword);
        cy.viewAHome(homeCheck, homeName, address);
        cy.visit("http://localhost:3000/billing");
        cy.wait(500).contains("Charger: ");
        cy.get("button[value='Send Payment']").click();
        cy.signoutOfApplication();
        cy.login(successUsername, successPassword);
        cy.viewAHome(homeCheck, homeName, address);
        cy.visit("http://localhost:3000/billing");
        cy.wait(500).contains("Date Paid:");
        cy.contains("Amount Paid: $");
        cy.viewAHome(homeCheck, homeName, address);
        cy.visit("http://localhost:3000/billing");
        cy.wait(500).contains("Date Paid:");
        cy.get("button[value='Confirm Payment']").click();
        cy.wait(500).contains("You have no charges pending approval.");
        cy.signoutOfApplication();
    })

    it("User can see payment history", () => {
        cy.login(successUsername, successPassword);
        cy.viewAHome(homeCheck, homeName, address);
        cy.visit("http://localhost:3000/history");
        cy.wait(500).contains("Charge History");
        cy.contains("you charged");
        cy.contains("✅ Confirmed");
        cy.contains("⭐ Total Amount: $");
        cy.visit("http://localhost:3000/createcharge");
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
    })
});