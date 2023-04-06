import { createProtectedRouter } from "./context";
import { z } from "zod";
import { canUserViewHome } from "../db/HomeService";
import { getSignedImage } from "./image-upload";
import { hasPermission } from "../db/UserService";
import { Permission } from "../../types/permissions";

export const homesRouter = createProtectedRouter()
    .query("getHomes", {
        async resolve({ ctx }) {
            if(!ctx.session.user){
                return;
            }
            const homes = await ctx.prisma.occupies.findMany({
                select: {
                    home: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            address: true,
                        }
                    }
                },
                where: {
                    userId: ctx.session.user.id,
                },
            });
            for(const home of homes){
                if(home.home.image)
                    home.home.image = await getSignedImage(home.home.image);
            }
            return homes.map((home) => home.home);
        },
    })
    .query("getHomeById", {
        input: z.object({
            homeId: z.string(),
        }),
        async resolve({ctx, input}) {
            if(!ctx.session.user){
                return;
            }
            const home = await ctx.prisma.occupies.findFirst({
                select: {
                    home: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            address: true,
                        }
                    }
                },
                where: {
                    userId: ctx.session.user.id,
                    homeId: input.homeId,
                },
            });
            if(!home || !home.home) return;
            if(home.home.image) 
                home.home.image = await getSignedImage(home.home.image);
            return home.home;
        },
    })
    .mutation("createHome", {
        input: z.object({
            name: z.string(),
            image: z.any(),
            address: z.string(),
        }),
        async resolve({ ctx, input }) {

            //Creates image key here so the image can bey placed in the S3 Bucket and referenced in the Prisma Database

            //Puts home info in prisma database
            const home =  await ctx.prisma.home.create({
                data: {
                    name: input.name,
                    image: input.image,
                    address: input.address,
                },
            });
            await ctx.prisma.occupies.create({
                data: {
                    userId: ctx.session.user.id,
                    homeId: home.id,
                }
            });

            await ctx.prisma.permission.create({
                data: {
                    occupiesUserId: ctx.session.user.id,
                    occupiesHomeId: home.id,
                    name: Permission.Owner,
                }
            })

            return home;
        },
    })
    .mutation("updateHome", {
        input: z.object({
            id: z.string(),
            name: z.string(),
            image: z.any(),
            address: z.string(),
        }),
        async resolve({ ctx, input }) {
            if(!(await hasPermission(ctx.session.user.id, input.id, Permission.Edit, ctx.prisma)) ||
               !(await canUserViewHome(ctx.session.user.id,input.id, ctx.prisma)))
                return;
            return await ctx.prisma.home.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    image: input.image,
                    address: input.address,
                },
            });
        },
    })
    .mutation("deleteHome", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ ctx, input }) {
            if(!(await hasPermission(ctx.session.user.id, input.id, Permission.Delete, ctx.prisma)) ||
               !(await canUserViewHome(ctx.session.user.id,input.id, ctx.prisma)))
                return;
            await ctx.prisma.occupies.deleteMany({
                where: {
                    homeId: input.id,
                }
            }); 
            return await ctx.prisma.home.delete({
                where: {
                    id: input.id,
                },
            });
        },
    });
