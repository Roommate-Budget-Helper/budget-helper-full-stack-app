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

export const moreThanOneOwner = async (userId:string, homeId: string, db: PrismaClient) => {
    const homeOwners = await db.permission.findMany({
        select: {
            occupiesUserId: true
        },
        where: {
            occupiesHomeId: homeId,
            name: "OWNER"
        }
    })
    if(homeOwners.length > 1) return true; 
    if(homeOwners[0]?.occupiesUserId !== userId) return true;
    return false;
}

export const homeAlreadyExists = async (homeName:string, homeAddress:string, db: PrismaClient) => {
    const home = await db.home.findFirst({
        where: {
            name: homeName,
            address: homeAddress
        }
    })
    if(home) return true;
    return false;
}
