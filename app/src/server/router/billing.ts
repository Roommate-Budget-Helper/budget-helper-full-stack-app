import { canUserViewHome } from "../db/HomeService";
import { canUserPayCharge, canUserConfirmCharge, handleSendChargeEmail } from "../db/ChargeService";
import { z } from "zod";
import { createProtectedRouter } from "./context";

export const billingRouter = createProtectedRouter()
.mutation("sendCharge",
{
    input: z.object({
        receiverId: z.string(),
        chargerId: z.string(),
        homeId: z.string(),
        amountBeforeSplit: z.string(),
        amount: z.string(),
        due: z.date(),
        comment: z.string(),
        category: z.string(),
    }),
    async resolve({ ctx, input }){
        if(!await canUserViewHome(ctx.session.user.id, input.homeId, ctx.prisma)) return;
        const result = await ctx.prisma.charge.create({
            data: {
                chargerId: input.chargerId,
                homeId: input.homeId,
                receiverId: input.receiverId,
                amountBeforeSplit: input.amountBeforeSplit,
                amount: input.amount,
                comment: input.comment,
                created: new Date(),
                dueDate: input.due,
                paid: false,
                confirmed: false,
                category: input.category,
            }
        });

        // send the email only on success of the charge creation
        if(result){
          // await handleSendChargeEmail(result, ctx.prisma);
        }
        
        return result;
    }
})
.mutation("payCharge", 
{
    input: z.object({
        paid: z.boolean(),
        chargeId: z.string()
    }),
    async resolve({ ctx, input }) {
        if(!await canUserPayCharge(ctx.session.user.id, input.chargeId, ctx.prisma)) return;
        return await ctx.prisma.charge.update({
            where: {
                chargeId: input.chargeId
            },
            data: {
                paid: input.paid,
                paidDate: new Date(),
            }
        })
    }
})
.mutation("confirmCharge", 
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
.query("getUnpaidCharges", { 
    async resolve({ ctx }){
        if(!ctx.session.user.email) return;

        return await ctx.prisma.charge.findMany({
            select: {
                chargeId: true,
                home: true,
                amountBeforeSplit: true,
                amount: true,
                dueDate: true,
                created: true,
                chargerId: true,
                chargeUser: { // charger data
                  select: {
                    name: true,
                    email: true,
                    image: true
                  }
                },
                comment: true
            },
            where: {
                receiverId: ctx.session.user.id,
                paid: false
            }
        });
        
    }
})
.query("getUnconfirmedCharges", { 
    async resolve({ ctx }){
        if(!ctx.session.user.email) return;

        return await ctx.prisma.charge.findMany({
            select: {
                chargeId: true,
                home: true,
                amountBeforeSplit: true,
                amount: true,
                dueDate: true,
                created: true,
                receiverId: true,
                receiveUser: { // receiver data
                  select: {
                    name: true,
                    email: true,
                    image: true
                  }
                },
                paidDate: true,
                comment: true
            },
            where: {
                chargerId: ctx.session.user.id,
                paid: true, 
                confirmed: false,
            }
        });
    }
}).query("getChargesThisMonth", {
    input: z.object({
        homeId: z.string()
    }),
    async resolve({ ctx, input }){
        return await ctx.prisma.charge.findMany({
            where: {
                chargerId: ctx.session.user.id,
                homeId: input.homeId,
                created: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
                }
            }
        });

    }
});
