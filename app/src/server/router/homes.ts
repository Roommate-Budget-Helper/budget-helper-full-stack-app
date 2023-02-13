import { createProtectedRouter } from "./context";
import { z } from "zod";
import { getHomesByUserId, canUserViewHome } from "../db/HomeService";
import { getSignedImage } from "./image-upload";

export const homesRouter = createProtectedRouter()
    .query("getHomes", {
        async resolve({ ctx }) {
            if(!ctx.session.user){
                return;
            }
            const homeIds = await getHomesByUserId(ctx.session.user.id, ctx.prisma);
            const homes = await ctx.prisma.home.findMany({
                select: {
                    id: true,
                    name: true,
                    image: true,
                    address: true,
                },
                where: {
                    id: {
                        in: homeIds,
                    },
                },
            });
            for(const home of homes){
                if(!home.image) continue;
                home.image = await getSignedImage(home.image);
            }
            return homes;
        },
    })
    .query("getHomeById", {
        input: z.object({
            homeId: z.string(),
        }),
        async resolve({ctx, input}) {
            if(!ctx.session.user || !(await canUserViewHome(ctx.session.user.id, input.homeId, ctx.prisma))){
                return;
            }            
            const home = await ctx.prisma.home.findFirst({
                select: {
                    id:true,
                    name: true,
                    image: true,
                    address: true,
                },
                where: {
                    id: {
                        in: input.homeId,
                    },
                },
            });
            if(!home) return;
            if(home.image) home.image = await getSignedImage(home.image);
            return home;
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
            return await ctx.prisma.home.create({
                data: {
                    name: input.name,
                    image: input.image,
                    address: input.address,
                },
            });
        },
    })
    .mutation("updateHome", {
        input: z.object({
            id: z.string(),
            name: z.string(),
            image: z.string(),
            address: z.string(),
        }),
        async resolve({ ctx, input }) {
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
