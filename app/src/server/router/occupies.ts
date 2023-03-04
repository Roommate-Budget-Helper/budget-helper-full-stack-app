import { createProtectedRouter } from "./context";
import { z } from "zod";

export const occupiesRouter = createProtectedRouter()
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
    .mutation("removeUserFromHome", {
        input: z.object({
            homeId: z.string(),
        }),
        async resolve({ ctx, input }){
            return await ctx.prisma.occupies.delete({
                where: {
                   userId_homeId: {
                    userId: ctx.session.user.id,
                    homeId: input.homeId,
                   }
                }
            });
        },
    })
    .query("getUsersInHome", {
      input: z.object({
        homeId: z.string(),
      }),
      async resolve({ ctx, input }) {
        const occupies = await ctx.prisma.occupies.findMany({
          where: {
            homeId: input.homeId,
          }
        });

        // TODO: return the user object
        return occupies.map(occupy => occupy.userId);
      }
    });
