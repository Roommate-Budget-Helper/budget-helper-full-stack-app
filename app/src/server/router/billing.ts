import { canUserViewHome } from "server/db/HomeService";
import { canUserPayCharge, canUserConfirmCharge } from "server/db/ChargeService";
import { sendEmail } from "server/services/email/invitation";
import { z } from "zod";
import { createProtectedRouter } from "./context";

export const billingRouter = createProtectedRouter()
.mutation("sendCharge",
{
    input: z.object({
        email: z.string().email(),
        homeId: z.string(),
        amount: z.number(),
        due: z.date(),
        comment: z.string()
    }),
    async resolve({ ctx, input }){
        if(!await canUserViewHome(ctx.session.user.id, input.homeId, ctx.prisma)) return;
        const home = await ctx.prisma.home.findFirst({
            select:{
                address: true
            },
            where: {
                id: input.homeId
            }
        });
        if(!home) return;
        // return await sendEmail(input.email, home.address); MAKE THIS AN EMAIL FOR A CHARGE
        return await ctx.prisma.charge.create({
            data: {
                chargerId: ctx.session.user.id,
                homeId: input.homeId,
                email: input.email,
                amount: input.amount,
                comment: input.comment,
                created: Date(),
                dueDate: input.due,
                paid: false,
                confirmed: false
            }
        });
    }
})
.mutation("payCharge", 
{
    input: z.object({
        paid: z.boolean(),
        chargeId: z.string()
    }),
    async resolve({ ctx, input }) {
        if(!ctx.session.user.email) return;
        if(!await canUserPayCharge(ctx.session.user.email, input.chargeId, ctx.prisma)) return;
        return await ctx.prisma.charge.update({
            where: {
                chargeId: input.chargeId
            },
            data: {
                paid: input.paid
            }
        })
    }
})
.mutation("confirmPay", 
{
    input: z.object({
        confirmed: z.boolean(),
        chargeId: z.string()
    }),
    async resolve({ ctx, input }) {
        if(!await canUserConfirmCharge(ctx.session.user.id, input.chargeId, ctx.prisma)) return;
        return await ctx.prisma.charge.update({
            where: {
                chargeId: input.chargeId
            },
            data: {
                confirmed: input.confirmed
            }
        });
    }
})
.query("getCharges", {
    async resolve({ ctx }){
        if(!ctx.session.user.email) return;
        const charges = await ctx.prisma.charge.findMany({
            select: {
                chargeId: true,
                home: true,
                amount: true,
                dueDate: true,
                created: true,
                chargerId: true,
                comment: true
            },
            where: {
                email: ctx.session.user.email
            }
        });
        return charges.map(charges => charges.charge);
    }
});