import { createRouter } from "./context";
import { z } from "zod";

export const registerRouter = createRouter()
    .mutation("createUser", {
        // add in the new user
        input: z.object({
            email: z.string(),
            username: z.string(),
        }),
        async resolve({ ctx, input }) {
            await ctx.prisma.user.create({
                data: {
                    email: input.email,
                    name: input.username,
                },
            });
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
