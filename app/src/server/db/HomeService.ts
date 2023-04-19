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