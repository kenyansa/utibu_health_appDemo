"use server"

import db from "@/db/db"
import { notFound } from "next/navigation"

export async function deletePatient(id: number) {
  const patient = await db.patient.delete({
    where: { id },
  })

  if (patient == null) return notFound()

  return patient
}