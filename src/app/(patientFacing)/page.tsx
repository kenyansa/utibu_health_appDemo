import { MedicationCard, MedicationCardSkeleton } from "@/components/MedicationCard"
import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { cache } from "@/lib/cache"
import { Medication } from "@prisma/client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

const getMostPopularMedications = cache(
  () => {
    return db.medication.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    })
  },
  ["/", "getMostPopularMedications"],
  { revalidate: 60 * 60 * 24 }
)

const getNewestMedications = cache(() => {
  return db.medication.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  })
}, ["/", "getNewestMedications"])

export default function HomePage() {
  return (
    <main className="space-y-12">
      <MedicationGridSection
        title="Most Common Meds at Utibu Health" 
        medicationsFetcher={getMostPopularMedications}
      />
      <MedicationGridSection title="Latest Meds" medicationsFetcher={getNewestMedications} />
    </main>
  )
}

type MedicationGridSectionProps = {
  title: string
  medicationsFetcher: () => Promise<Medication[]>
}

function MedicationGridSection({
  medicationsFetcher,
  title,
}: MedicationGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/medications" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <MedicationCardSkeleton />
              <MedicationCardSkeleton />
              <MedicationCardSkeleton />
            </>
          }
        >
          <MedicationSuspense medicationsFetcher={medicationsFetcher} />
        </Suspense>
      </div>
    </div>
  )
}

async function MedicationSuspense({
  medicationsFetcher,
}: {
  medicationsFetcher: () => Promise<Medication[]>
}) {
  return (await medicationsFetcher()).map(medication => (
    <MedicationCard key={medication.id} {...medication} />
  ))
}