import db from "@/db/db"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import PurchaseReceiptEmail from "@/email/PurchaseReceipt"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  )

  if (event.type === "charge.succeeded") {
    const charge = event.data.object
    const medicationId = parseInt(charge.metadata.medicationId)
    const email = charge.billing_details.email
    const pricePaidInShillings = charge.amount

    const medication = await db.medication.findUnique({ where: { id: medicationId } })
    if (medication == null || email == null) {
      return new NextResponse("Bad Request", { status: 400 })
    }

    const patientFields = {
      email,
      orders: { create: { medicationId, pricePaidInShillings } },
    }
    const {
      orders: [order]} = await db.patient.upsert({
      where: { email },
      create: patientFields,
      update: patientFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    })

    const downloadVerification = await db.downloadVerification.create({
      data: {
        medicationId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order Confirmation",
      react: (
        <PurchaseReceiptEmail
          order={order}
          medication={medication}
          downloadVerificationId={downloadVerification.id}
        />
      ),
    })
  }

  return new NextResponse()
}