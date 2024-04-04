import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

interface SuccessPageProps {
    searchParams: {
      payment_intent: string;
    };
  }

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        searchParams.payment_intent
      );
      if (!paymentIntent.metadata.medicationId) return notFound();
  
      const medication = await db.medication.findUnique({
        where: { id: Number(paymentIntent.metadata.medicationId) },
      });
      if (!medication) return notFound();

  const isSuccess = paymentIntent.status === "succeeded"

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "Success!" : "Error!"}
      </h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={medication.imagePath}
            fill
            alt={medication.name}
            className="object-cover"
            width={400} // Adjust width and height as needed
            height={400}
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(medication.priceInShillings)}
          </div>
          <h1 className="text-2xl font-bold">{medication.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {medication.description}
          </div>
          <Button className="mt-4" size="lg" asChild>
            {isSuccess ? (
              <a
                href={`/medications/download/${await createDownloadVerification(
                  medication.id.toString() 
                )}`} // Convert to string
              >
                Download
              </a>
            ) : (
              <Link href={`/medications/${medication.id}/purchase`}>
                Try Again
              </Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} catch (error) {
  console.error("Error:", error);
  // Handle errors gracefully, possibly redirect to an error page
  return <div>Error occurred. Please try again later.</div>;
}
}

async function createDownloadVerification(medicationId: string) {
    const verification = await db.downloadVerification.create({
      data: {
        medicationId: Number(medicationId), // Ensure medicationId is a number
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    return verification.id;
  }