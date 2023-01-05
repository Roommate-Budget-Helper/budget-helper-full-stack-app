import { createRouter } from "./context";
import { z } from "zod";
import {
    CognitoUserAttribute,
    CognitoUserPool,
} from "amazon-cognito-identity-js";
import { env } from "../../env/server.mjs";

export const registerRouter = createRouter()
    .mutation("createUser", {
        input: z.object({
            email: z.string(),
            username: z.string(),
            password: z.string(),
        }),
        async resolve({ ctx, input }) {
            const userPool = new CognitoUserPool({
                ClientId: env.COGNITO_CLIENT_ID,
                UserPoolId: env.COGNITO_USER_POOL,
            });

            // return the user object and send errors back to the client if there are any for adding a new user to the user pool
            return userPool.signUp(
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
                        // console.log(err.message);
                        throw err;
                        // return JSON.stringify(err);
                    }
                    if (result) {
                        return ctx.prisma.user.create({
                            data: {
                                email: input.email,
                                name: input.username,
                            },
                        });
                    }
                }
            );
        },
    })
    .query("validateEmail", {
        // check if email already exists
        input: z.object({
            email: z.string(),
        }),
        async resolve({ ctx, input }) {
            return await ctx.prisma.user.findUnique({
                select: {
                    email: true,
                },
                where: {
                    email: input.email,
                },
            });
        },
    })
    .query("validateUsername", {
        // check if username already exists
        input: z.object({
            username: z.string(),
        }),
        async resolve({ ctx, input }) {
            return await ctx.prisma.user.findFirst({
                select: {
                    name: true,
                },
                where: {
                    name: input.username,
                },
            });
        },
    });
