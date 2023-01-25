import { PrismaClient } from "@prisma/client";

export const getHomesByUserId = async (id: string, db: PrismaClient): Promise<string[]> => {
    return (await db.occupies.findMany({
        select: {
            homeId: true,
        },
        where: {
            userId:id,
        },
    })).map(homeObj => homeObj.homeId);
}

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