import { PrismaClient } from "@prisma/client";

export const canUserViewHome = async (id: string, homeId: string, db: PrismaClient) => {
    return !!(await db.occupies.findFirst({
        select: {
           homeId: true,
        },
        where: {
            homeId,
            userId: id
        }
    }));
}

export const userIsInvited = async (email: string, homeId: string, db: PrismaClient) => {
    return !!(await db.invitation.findFirst({
        select: {
            homeId: true,
        },
        where: {
            homeId: homeId,
            email: email
        }
    }))
}

export const userIsInHome = async (email: string, homeId: string, db: PrismaClient) => {
    return !!(await db.occupies.findFirst({
        select: {
            homeId: true,
        },
        where: {
            homeId: homeId,
            userId: email,
        }
    }))
}