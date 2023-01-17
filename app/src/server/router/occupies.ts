import { createRouter } from "./context";
import { z } from "zod";

export const occupiesRouter = createRouter()
    .mutation("addUserToHome", {
        input: z.object({
            homeId: z.string(),
        }),
        async resolve({ ctx, input }) {
            if(!ctx.session?.user){
                return;
            }
            return await ctx.prisma.occupies.create({
                data: {
                    userId: ctx.session.user.id,
                    homeId: input.homeId,
                },
            });
        },
    })
    .query("getUserHomeIds", {
        async resolve({ ctx }) {
            if(!ctx.session?.user){
                return;
            }
            return await ctx.prisma.occupies.findMany({
                select: {
                    homeId: true,
                },
                where: {
                    userId: ctx.session.user.id,
                },
            });
        },
    });
