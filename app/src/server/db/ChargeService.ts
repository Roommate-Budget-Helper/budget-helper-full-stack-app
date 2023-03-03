import { PrismaClient } from "@prisma/client";

export const canUserPayCharge = async (email: string, chargeId: string, db: PrismaClient) => {
    return !!(await db.charge.findFirst({
        select: {
           chargeId: true,
        },
        where: {
            chargeId: chargeId,
            email: email
        }
    }));
}

export const canUserConfirmCharge = async (id: string, chargeId: string, db: PrismaClient) => {
    return !!(await db.charge.findFirst({
        select: {
           chargeId: true,
        },
        where: {
            chargeId: chargeId,
            chargerId: id
        }
    }));
}