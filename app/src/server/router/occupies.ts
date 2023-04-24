import { createProtectedRouter } from "./context";
import { z } from "zod";
import { getUserPermissions, hasPermission } from "../db/UserService";
import { Permission } from "../../types/permissions";
import { canUserViewHome } from "../db/HomeService";
import { getSignedImage } from "./image-upload";

export const occupiesRouter = createProtectedRouter()
    .mutation("addUserToHome", {
        input: z.object({
            homeId: z.string(),
        }),
        async resolve({ ctx, input }) {
            if (!ctx.session?.user) {
                return;
            }
            return ctx.prisma.occupies.create({
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
            return ctx.prisma.occupies.delete({
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
            if (!(await hasPermission(ctx.session.user.id, input.homeId, Permission.Owner, ctx.prisma))) {
                return;
            }
            return ctx.prisma.occupies.delete({
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
            const users = await ctx.prisma.occupies.findMany({
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
            for(const user of users) {
                if (user.user.image) {
                    user.user.image = await getSignedImage(user.user.image);
                }
            }
            return users;
        },
    })
    .query("getPermissions", {
        input: z.object({
            homeId: z.string(),
        }),
        async resolve({ ctx, input }) {
            return getUserPermissions(
                ctx.session.user.id,
                input.homeId,
                ctx.prisma
            );
        },
    })
    .mutation("UpdatePermissions", {
        input: z.object({
            user: z.string(),
            homeId: z.string(),
            permissions: z.array(z.nativeEnum(Permission)),
        }),
        async resolve({ ctx, input }) {
            if (
                !(await canUserViewHome(
                    ctx.session.user.id,
                    input.homeId,
                    ctx.prisma
                )) ||
                !(await hasPermission(
                    ctx.session.user.id,
                    input.homeId,
                    Permission.Owner,
                    ctx.prisma
                ))
            )
                return;
            await ctx.prisma.permission.deleteMany({
                where: {
                    occupiesHomeId: input.homeId,
                    occupiesUserId: input.user,
                }
            });

            return ctx.prisma.permission.createMany({
                data: input.permissions.map((permission) => ({
                    name: permission,
                    occupiesUserId: input.user,
                    occupiesHomeId: input.homeId,
                })),
            });
        },
    });