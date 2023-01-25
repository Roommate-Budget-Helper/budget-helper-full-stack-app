import {test, expect, jest} from "@jest/globals";
import { appRouter } from "..";
import { prisma } from  "../../db/client"
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import * as cognito from "amazon-cognito-identity-js";

type signUpArgs = Parameters<typeof cognito.CognitoUserPool.prototype.signUp>

const mockSignUp = jest.fn();
const mockCognitoUserAttribute = jest.fn<(args: cognito.ICognitoUserAttributeData) => Partial<typeof cognito.CognitoUserAttribute.prototype>>((args) => args);

jest.mock("amazon-cognito-identity-js", () => ({
    _esModule: true,
    CognitoUserPool: jest.fn().mockImplementation(() => {
        return {
            signUp: (...args: signUpArgs)  => mockSignUp(...args)
        }
    }),
    CognitoUserAttribute: (data: cognito.ICognitoUserAttributeData) => mockCognitoUserAttribute(data)
}));

describe('User Registration', () => {
    test("create user test", async () => {

        const prismaMock = mockDeep<PrismaClient>();
        
        const caller = appRouter.createCaller({session: null, prisma: prismaMock});
        const input = {
            email: "chuss@shlatts.realm",
            username: "chusschamp",
            password: "11111"
        };
        const result = await caller.mutation("auth.createUser", input);
        expect(mockCognitoUserAttribute).toBeCalledWith({"Name": "email", "Value": "chuss@shlatts.realm"});
        const [username, password, attributes] = mockSignUp.mock.calls[0] as signUpArgs;
        expect(username).toBe(input.username);
        expect(password).toBe(input.password);
        expect(attributes).toEqual(mockCognitoUserAttribute.mock.calls[0]);
    });


});