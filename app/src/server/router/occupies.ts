import { createProtectedRouter } from "./context";
import { z } from "zod";
import { getUserPermissions, hasPermission } from "server/db/UserService";
import { Permission } from "types/permissions";
import { canUserViewHome } from "server/db/HomeService";

export const occupiesRouter = createProtectedRouter()
    .mutation("addUserToHome", {
        input: z.object({
            homeId: z.string(),
        }),
        async resolve({ ctx, input }) {
            if (!ctx.session?.user) {
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
        async resolve({ ctx, input }) {
            return await ctx.prisma.occupies.delete({
                where: {
                    userId_homeId: {
                        userId: ctx.session.user.id,
                        homeId: input.homeId,
                    },
                },
            });
        },
    })
    .query("getUsersInHome", {
        input: z.object({
            homeId: z.string().nullable(),
        }),
        async resolve({ ctx, input }) {
            if (!input.homeId) {
                return [];
            }
            return await ctx.prisma.occupies.findMany({
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    }
                },
                where: {
                    homeId: input.homeId,
                },
            });
        },
    })
    .query("getPermissions", {
        input: z.object({
            homeId: z.string(),
        }),
        async resolve({ ctx, input }){
            return await getUserPermissions(ctx.session.user.id, input.homeId, ctx.prisma)
        }
    })
    .mutation("UpdatePermissions", {
        input: z.object({
            user: z.string(),
            homeId: z.string(),
            permissions: z.array(z.nativeEnum(Permission)),
        }),
        async resolve({ ctx, input }){
            if(!(await canUserViewHome(ctx.session.user.id, input.homeId, ctx.prisma)) ||
               !(await hasPermission(ctx.session.user.id, input.homeId, Permission.Owner, ctx.prisma)))
               return; 
            await ctx.prisma.permission.deleteMany({
                where: {
                   occupiesHomeId: input.homeId,
                   occupiesUserId: input.user,
                }
            });
            
            return await ctx.prisma.permission.createMany({
                data: input.permissions.map(permission => ({
                    name: permission,
                    occupiesUserId: input.user,
                    occupiesHomeId: input.homeId
                }))
            });
        }
    });