import { PrismaClient } from "@prisma/client";
import { Permission } from "../../types/permissions";

export const getUserPermissions = async (user: string, homeId: string, db: PrismaClient) => {
    return (await db.occupies.findFirst({
        select: {
            permissions: true,
        },
        where: {
            userId: user,
            homeId,
        }
    }))?.permissions;
}

export const hasPermission = async (user: string, homeId: string, permission: Permission, db: PrismaClient) => {
    return !!(await db.permission.findFirst({
        where: {
            OR: [
                {
                    name: permission,
                }, {
                    name: Permission.Owner,
                }, {
                    name: Permission.Admin,
                }
            ], 
            occupiesUserId: user,
            occupiesHomeId: homeId,
        }
    }))
}