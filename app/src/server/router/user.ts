import { createProtectedRouter } from "./context";
import { z } from "zod";

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
            })
        }
    });