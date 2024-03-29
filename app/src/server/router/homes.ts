import { createProtectedRouter } from "./context";
import { z } from "zod";
import { canUserViewHome, homeAlreadyExists } from "../db/HomeService";
import { getSignedImage } from "./image-upload";
import { hasPermission } from "../db/UserService";
import { Permission } from "../../types/permissions";

export const homesRouter = createProtectedRouter()
    .query("getHomes", {
        async resolve({ ctx }) {
            if(!ctx.session.user){
                return;
            }
            const homes = await ctx.prisma.home.findMany({
                select: {
                    id: true,
                    name: true,
                    image: true,
                    address: true,
                },
                where: {
                    Occupies: {
                       some: {
                            userId: ctx.session.user.id,
                       }
                    }
                },
            });
            
            const homePromises = [];
            for(const home of homes){
                if(!home.image) continue;
                homePromises.push(new Promise<{
                    id: string,
                    image: string,
                }>((resolve, reject) => {
                   getSignedImage(home.image!).then(
                    image => resolve({
                        id: home.id,
                        image,
                    })
                   ).catch(reject); 
                }));
            }
            const homeImages = await Promise.all(homePromises);
            for(const homeImage of homeImages){
                const home = homes.find(home => home.id === homeImage.id);
                if(!home) continue;
                home.image = homeImage.image;
            }
            return homes;
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
            if(await homeAlreadyExists(input.name, input.address, ctx.prisma)) {
                return "bad";
            }

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
            if(await homeAlreadyExists(input.name, input.address, ctx.prisma)) {
                return "bad";
            }
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
            await ctx.prisma.permission.deleteMany({
                where: {
                    occupiesHomeId: input.id,
                }
            })
            return await ctx.prisma.home.delete({
                where: {
                    id: input.id,
                },
            });
        },
    });
