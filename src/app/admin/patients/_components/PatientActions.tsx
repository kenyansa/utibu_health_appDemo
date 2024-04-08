"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import { deletePatient } from "../../_actions/patients"
import { useRouter } from "next/navigation"

export function DeleteDropDownItem({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deletePatient(id)
          router.refresh()
        })
      }
    >
      Delete
    </DropdownMenuItem>
  )
}