import { canUserViewHome } from "server/db/HomeService";
import { sendEmail } from "server/services/email/invitation";
import { z } from "zod";
import { createProtectedRouter } from "./context";
import { getSignedImage } from "./image-upload";

export const invitationRouter = createProtectedRouter()
.mutation("sendInvitation",
{
    input: z.object({
        email: z.string().email(),
        homeId: z.string()
    }),
    async resolve({ ctx, input }){
        if(!await canUserViewHome(ctx.session.user.id, input.homeId, ctx.prisma)) return;
        const home = await ctx.prisma.home.findFirst({
            select: {
                address: true
            },
            where: {
                id: input.homeId
            }
        });
        if(!home) return;
        // return await sendEmail(input.email, home.address);
        return await ctx.prisma.invitation.create({
            data: {
                initiatorId: ctx.session.user.id,
                homeId: input.homeId,
                email: input.email
            }
        });
    }
})
.mutation("acceptInvitation", {
    input: z.object({
        homeId: z.string(),
        accepted: z.boolean()
    }),
    async resolve({ ctx, input }) {
        const email = ctx.session.user.email;
        if(!email) return;
        if(input.accepted){
            await ctx.prisma.occupies.create({
                data: {
                    homeId: input.homeId,
                    userId: ctx.session.user.id,
                }
            });
        }
        await ctx.prisma.invitation.delete({
            where:{
                homeId_email: {
                    homeId: input.homeId,
                    email: email,
                }
            }
        });
    }
})
.query("getInvitations", {
    async resolve({ ctx }){
        if(!ctx.session.user.email) return;
        const homes = await ctx.prisma.invitation.findMany({
            select: {
                home: true
            },
            where: {
                email: ctx.session.user.email
            }
        });
        const homesMapped = homes.map(home => home.home);
        for(const home of homesMapped){
            if(home.image){
                home.image = await getSignedImage(home.image);
            }
        }
        return homesMapped;
    }
});