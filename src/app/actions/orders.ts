"use server"

import db from "@/db/db"

export async function userOrderExists(email: string, medicationId: number) {
    return (
      (await db.order.findFirst({
        where: { patient: { email }, 
        medications: {some: {id: medicationId }} // Check if there's at least one medication with the provided ID associated with the order
      }, 
        select:    { id: true },
      })) != null
    )
  }
  
  