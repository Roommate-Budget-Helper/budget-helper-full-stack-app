import { createProtectedRouter } from "./context";
import { z } from "zod";
import { getUserPermissions, hasPermission, isOwner } from "../db/UserService";
import { Permission } from "../../types/permissions";
import { canUserViewHome, moreThanOneOwner, userIsInHome } from "../db/HomeService";

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
            if(!(await moreThanOneOwner(ctx.session.user.id, input.homeId, ctx.prisma))) {
                return "bad";
            }
            await ctx.prisma.permission.deleteMany({
                where: {
                    occupiesHomeId: input.homeId,
                    occupiesUserId: ctx.session.user.id
                }
            })
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
    .mutation("removeUserFromHomeById", {
        input: z.object({
            homeId: z.string(),
            userId: z.string(),
        }),
        async resolve({ ctx, input }) {
            if (!(await hasPermission(ctx.session.user.id, input.homeId, Permission.Owner, ctx.prisma)) ||
                !(await userIsInHome(input.userId, input.homeId, ctx.prisma)) ||
                ((await isOwner(input.userId, input.homeId, ctx.prisma)) && 
                !(await moreThanOneOwner(input.userId, input.homeId, ctx.prisma)))) {
                return "bad";
            }
            await ctx.prisma.permission.deleteMany({
                where: {
                    occupiesHomeId: input.homeId,
                    occupiesUserId: input.userId
                }
            })
            return await ctx.prisma.occupies.delete({
                where: {
                    userId_homeId: {
                        userId: input.userId,
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
               !(await hasPermission(ctx.session.user.id, input.homeId, Permission.Owner, ctx.prisma)) ||
               (await ctx.session.user.id === input.user))
               return "bad"; 
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