import db from "@/db/db"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { medication: { select: { filePath: true, name: true } } },
  })

  if (data == null) {
    return NextResponse.redirect(new URL("/medications/download/expired", req.url))
  }

  const { size } = await fs.stat(data.medication.filePath)
  const file = await fs.readFile(data.medication.filePath)
  const extension = data.medication.filePath.split(".").pop()

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.medication.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
})
}