import { createRouter } from "./context";
import { z } from "zod";

export const homesRouter = createRouter()
    .query("getHomes", {
        input: z.object({
            ids: z.array(z.string()),
        }),
        async resolve({ ctx, input }) {
            return await ctx.prisma.home.findMany({
                select: {
                    id: true,
                    name: true,
                    image: true,
                    address: true,
                },
                where: {
                    id: {
                        in: input.ids,
                    },
                },
            });
        },
    })
    .mutation("createHome", {
        input: z.object({
            name: z.string(),
            image: z.string(),
            address: z.string(),
        }),
        async resolve({ ctx, input }) {
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
            return await ctx.prisma.home.delete({
                where: {
                    id: input.id,
                },
            });
        },
    });
