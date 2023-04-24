import { createProtectedRouter } from "./context";
import { z } from "zod";
import { getSignedImage } from "./image-upload";

export const userRouter = createProtectedRouter()
    .mutation("setProfileImage", {
        input: z.object({
            image: z.any(),
        }),
        async resolve({ ctx, input }) {
            return await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    image: input.image,
                },
            });
        },
    })
    .query("getProfileImage", {
        async resolve({ ctx }) {
            const key =  await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.session.user.id,
                },
                select: {
                    image: true,
                },
            });
            if (key?.image) {
                return getSignedImage(key?.image);
            }
        },
    })
    .query("getPaymentMethods", {
        async resolve({ ctx }) {
            return ctx.prisma.user.findUnique({
                where: {
                    id: ctx.session.user.id,
                },
                select: {
                    paymentMethods: true,
                },
            });
        },
    })
    .mutation("setPaymentMethods", {
        input: z.object({
            paymentMethods: z.array(z.string()),
        }),
        async resolve({ ctx, input }) {
            return ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    paymentMethods: input.paymentMethods,
                },
            });
        },
    });