import { createRouter } from "./context";
import { z } from "zod";

export const occupiesRouter = createRouter()
    .mutation("addUserToHome", {
        input: z.object({
            userId: z.string(),
            homeId: z.string(),
        }),
        async resolve({ ctx, input }) {
            return await ctx.prisma.occupies.create({
                data: {
                    userId: input.userId,
                    homeId: input.homeId,
                },
            });
        },
    })
    .query("getUserHomeIds", {
        input: z.object({
            userId: z.string(),
        }),
        async resolve({ ctx, input }) {
            return await ctx.prisma.occupies.findMany({
                select: {
                    homeId: true,
                },
                where: {
                    userId: input.userId,
                },
            });
        },
    });
