import { MedicationCard, MedicationCardSkeleton } from "@/components/MedicationCard"
import db from "@/db/db"
import { cache } from "@/lib/cache"
import { Suspense } from "react"

const getMedications = cache(() => {
  return db.medication.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: "asc" },
  })
}, ["/medications", "getMedications"])

export default function MedicationsPage(){
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <MedicationCardSkeleton />
              <MedicationCardSkeleton />
              <MedicationCardSkeleton />
              <MedicationCardSkeleton />
              <MedicationCardSkeleton />
              <MedicationCardSkeleton />
            </>
          }
        >
          <MedicationsSuspense />
        </Suspense>
      </div>
    )
}
async function MedicationsSuspense(){
    const medications = await getMedications()
    return medications.map(medication => <MedicationCard key={medication.id} {...medication} />)

}