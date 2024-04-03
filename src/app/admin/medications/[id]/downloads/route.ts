import db from "@/db/db"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const medication = await db.medication.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  })

  if (medication == null) return notFound()

  const { size } = await fs.stat(medication.filePath)
  const file = await fs.readFile(medication.filePath)
  const extension = medication.filePath.split(".").pop()

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${medication.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  })
}