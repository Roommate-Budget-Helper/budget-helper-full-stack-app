import {test, expect, jest} from "@jest/globals";
import { appRouter } from "..";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import * as cognito from "amazon-cognito-identity-js";

// Extract the type of the arguments of the signUp function on CognitoUserPool
type signUpArgs = Parameters<typeof cognito.CognitoUserPool.prototype.signUp>;

// Create a mock sign up result to test if we are properly getting userSub on prisma create
const mockSignUpResult: cognito.ISignUpResult = {
    userSub: "test", // this is the only field we care about, the rest are fake values to adhere to the type
    user: new cognito.CognitoUser({
        Username: "test",
        Pool: new cognito.CognitoUserPool({
            UserPoolId: "test",
            ClientId: "test",
        })
    }),
    userConfirmed: false,
    codeDeliveryDetails: {
        AttributeName: "email",
        DeliveryMedium: "email",
        Destination: "chuss@shlatts.realm"
    }
};

// Create the mock of the signup function so we can test that the arguments are passed correctly
// and to make sure prisma gets the right user information
const mockSignUp = jest.fn<(...args: signUpArgs) => void>((...args) => {
    const callback = args[4];
    callback(undefined, mockSignUpResult);
});

// Creates a mock of the CognitoUserAttribute class to adhere to the 3rd argument of sign up
const mockCognitoUserAttribute = jest.fn<(args: cognito.ICognitoUserAttributeData) => Partial<typeof cognito.CognitoUserAttribute.prototype>>((args) => args);

// Overrides the amazon-cognito-identity-js module with our mock implementations
jest.mock("amazon-cognito-identity-js", () => ({
    _esModule: true,
    CognitoUserPool: jest.fn().mockImplementation(() => {
        return {
            signUp: (...args: signUpArgs)  => mockSignUp(...args),
        }
    }),
    CognitoUser: jest.fn(),
    CognitoUserAttribute: (data: cognito.ICognitoUserAttributeData) => mockCognitoUserAttribute(data)
}));

describe('User Registration', () => {
    test("create user test", async () => {
        // Creates mock of prisma client
        const prismaMock = mockDeep<PrismaClient>();
        
        // Configures trpc with a null session (user object) amd the mocked prisma client
        const caller = appRouter.createCaller({session: null, prisma: prismaMock});

        // Input for the signup function
        const input = {
            email: "chuss@shlatts.realm",
            username: "chusschamp",
            password: "11111"
        };

        // Calls createUser function UUT
        await caller.mutation("auth.createUser", input);

        // Checks to make sure email Cognito User Attribute is called correctly
        expect(mockCognitoUserAttribute).toBeCalledWith({"Name": "email", "Value": "chuss@shlatts.realm"});
        
        // ensures mockSignUp was called atleast once
        if(!mockSignUp.mock.calls[0]){
            fail();
        }
        
        // Takes username, password, and attributes from mockSignUp call
        const [username, password, attributes] = mockSignUp.mock.calls[0];

        // Makes sure username is inputted correctly
        expect(username).toBe(input.username);

        // Makes sure password is inputted correctly
        expect(password).toBe(input.password);

        // Makes sure attributes have been passed in
        expect(attributes).toEqual(mockCognitoUserAttribute.mock.calls[0]);

        // Makes sure prisma creates a user with the correct data
        expect(prismaMock.user.create).toBeCalledWith({
            data: {
                id: "test",
                email: input.email,
                name: input.username,
            }
        });
    });
});