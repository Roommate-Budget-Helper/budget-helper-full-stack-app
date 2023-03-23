import { createRouter } from "./context";
import { z } from "zod";
import {
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
} from "amazon-cognito-identity-js";
import { env } from "../../env/server.mjs";
import { TRPCError } from "@trpc/server";

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

            const attributeEmail = new CognitoUserAttribute({
                Name: "email",
                Value: input.email,
            });

            return new Promise((resolve, reject) =>
                userPool.signUp(
                    input.username,
                    input.password,
                    [attributeEmail],
                    [],
                    (err, result) => {
                        if (err || !result) {
                            console.log(err);
                            reject(
                                new TRPCError({
                                    code: "BAD_REQUEST",
                                    message: err?.message,
                                    cause: err?.cause,
                                })
                            );
                            return;
                        }

                        resolve(
                            ctx.prisma.user.create({
                                data: {
                                    id: result.userSub,
                                    email: input.email,
                                    name: input.username,
                                },
                            })
                        );
                    }
                )
            );
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

            return new Promise((resolve, reject) =>
                new CognitoUser(userData).confirmRegistration(
                    input.code,
                    true,
                    (err, result) => {
                        if (err) {
                            console.error(err);

                            reject(
                                new TRPCError({
                                    code: "BAD_REQUEST",
                                    message: err.message,
                                    cause: err.cause,
                                })
                            );
                        }

                        resolve(result);
                    }
                )
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

            return new Promise((resolve, reject) =>
                new CognitoUser(userData).forgotPassword({
                    onSuccess: function (result) {
                        resolve(result);
                    },
                    onFailure: function (err) {
                        console.log(err);
                        reject(
                            new TRPCError({
                                code: "BAD_REQUEST",
                                message: err.message,
                                cause: err.cause,
                            })
                        );
                    },
                })
            );
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
            return new Promise((resolve, reject) =>
                new CognitoUser(userData).confirmPassword(
                    input.code,
                    input.password,
                    {
                        onSuccess: function (result) {
                            resolve(result);
                        },
                        onFailure: function (err) {
                            console.log(err);
                            reject(
                                new TRPCError({
                                    code: "BAD_REQUEST",
                                    message: err.message,
                                    cause: err.cause,
                                })
                            );
                        },
                    }
                )
            );
        },
    });
