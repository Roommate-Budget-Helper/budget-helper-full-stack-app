import { PrismaClient } from "@prisma/client";
import { Charge } from "@prisma/client";
import { sendEmail } from "../services/email/charge";

export const canUserPayCharge = async (receiveId: string, chargeId: string, db: PrismaClient) => {
    return !!(await db.charge.findFirst({
        select: {
           chargeId: true,
        },
        where: {
            chargeId: chargeId,
            receiverId: receiveId,
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

// TODO: Test this function once ses is setup
export const handleSendChargeEmail = async (charge: Charge, db: PrismaClient) => {
  // TODO: I dont know if we need to get the home info and user info here from separate queries
  // or if we can just get it from the charge object

  const home = await db.home.findFirst({
      where: {
          id: charge.homeId,
      },
      select: {
          address: true,
          name: true,
      },
  });

  if (!home) return; // TODO: Throw some error here if the home is not found

  const charger = await db.user.findFirst({
      where: {
          id: charge.chargerId,
      },
      select: {
          name: true,
          email: true,
      },
  });

  if(!charger) return; // TODO: Throw some error here if the charger is not found

  const receiver = await db.user.findFirst({
      where: {
          id: charge.receiverId,
      },
      select: {
          name: true,
          email: true,
      },
  });

  if(!receiver) return; // TODO: Throw some error here if the receiver is not found

  return await sendEmail(receiver.email, {chargerUsername: charger.name, homeName: home.name, amountOwed: charge.amount, dueDate: charge.dueDate, address: home.address})
}


