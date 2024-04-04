import db from "@/db/db"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { CheckoutForm } from "./_components/CheckoutForm"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string }
}) {
  const medication = await db.medication.findUnique({ where: { id: parseInt(id) } })
  if (medication == null) return notFound()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: medication.priceInShillings,
    currency: "KSH",
    metadata: { medicationId: medication.id },
  })

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent")
  }

  const description = medication.description || "" //default value for the description property if it's null

  return (
    <CheckoutForm
      medication={{...medication,
    description: description,}}
      clientSecret={paymentIntent.client_secret}
    />
  )
}