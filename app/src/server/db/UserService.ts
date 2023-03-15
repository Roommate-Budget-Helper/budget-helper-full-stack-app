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
    const conditions = [
        {
            name: permission,
        }
    ];
    if(permission !== Permission.Owner){
        conditions.push({
            name: Permission.Owner,
        }, {
            name: Permission.Admin,
        });
    }
    
    return !!(await db.permission.findFirst({
        where: {
            OR: conditions, 
            occupiesUserId: user,
            occupiesHomeId: homeId,
        }
    }))
}