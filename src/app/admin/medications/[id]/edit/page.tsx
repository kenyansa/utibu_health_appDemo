import db from "@/db/db"
import { PageHeader } from "../../../_components/PageHeader";
import { MedicationForm } from "../../_components/MedicationForm";

export default async function EditMedicationPage({
    params: { id },
  }: {
    params: { id: string };
  }) {
    const medication = await db.medication.findUnique({ where: { id: parseInt(id) } }); //pass id as integer
    return (
      <>
        <PageHeader>Edit Medication</PageHeader>
        <MedicationForm medication={medication} />
      </>
    );
  }
  