import { createRouter } from "./context";
import { z } from "zod";
import {
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
} from "amazon-cognito-identity-js";
import { env } from "../../env/server.mjs";

const userPool = new CognitoUserPool({
    ClientId: env.COGNITO_CLIENT_ID,
    UserPoolId: env.COGNITO_USER_POOL,
});

export const registerRouter = createRouter()
    .mutation("createUser", {
        input: z.object({
            email: z.string(),
            username: z.string(),
            password: z.string(),
        }),
        async resolve({ ctx, input }) {
            // return the user object and send errors back to the client if there are any for adding a new user to the user pool
            let error = null;
            const signupAuth = userPool.signUp(
                input.username,
                input.password,
                [
                    new CognitoUserAttribute({
                        Name: "email",
                        Value: input.email,
                    }),
                ],
                [],
                function (err, result) {
                    if (err) {
                        // TODO: send error to client
                        error = err;
                        throw err;
                    }
                    else if (result) {
                        return ctx.prisma.user.create({
                            data: {
                                id: result.userSub,
                                email: input.email,
                                name: input.username,
                            },
                        });
                    }
                }
            );
            if(!error) return signupAuth;
            return error;
        },
    })
    .mutation("verifyEmailCode", {
        input: z.object({
            username: z.string(),
            code: z.string(),
        }),
        async resolve({ input }) {
            const userData = {
                Username: input.username,
                Pool: userPool,
            };
            const cognitoUser = new CognitoUser(userData);
            cognitoUser.confirmRegistration(
                input.code,
                true,
                function (err, result) {
                    if (err) {
                        //handle error
                        console.error(err);
                    }
                    console.log(result);
                }
            );
        },
    })
    // Send Forgot Password Code to email in Cognito
    .mutation("sendForgotPasswordVerificationCode", {
        input: z.object({
            username: z.string(),
        }),
        async resolve({ input }) {
            const userData = {
                Username: input.username,
                Pool: userPool,
            };
            const cognitoUser = new CognitoUser(userData);
            cognitoUser.forgotPassword({
                onSuccess: function (result) {
                    console.log("call result: " + result);
                },
                onFailure: function (err) {
                    console.log(err);
                },
            });
        },
    })
    // Enter in new password and verification code provided by email
    .mutation("verifyForgotPassword", {
        input: z.object({
            username: z.string(),
            code: z.string(),
            password: z.string(),
        }),
        async resolve({ input }) {
            const userData = {
                Username: input.username,
                Pool: userPool,
            };
            const cognitoUser = new CognitoUser(userData);
            cognitoUser.confirmPassword(input.code, input.password, {
                onSuccess() {
                    console.log("Password confirmed!");
                },
                onFailure(err) {
                    console.log("Error: ", err);
                },
            });
        },
    });
