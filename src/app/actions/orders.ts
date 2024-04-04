"use server"

import db from "@/db/db"

export async function userOrderExists(email: string, medicationId: number) {
    return (
      (await db.order.findFirst({
        where: { patient: { email }, medication: { id: medicationId } }, // Assuming medication ID field is 'id'
        select: { id: true },
      })) != null
    )
  }
  