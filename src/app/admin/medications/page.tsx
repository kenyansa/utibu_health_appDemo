import { PageHeader } from "../_components/PageHeader";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow,
} from "@/components/ui/table";
import {
    ActiveToggleDropdownItem,
    DeleteDropdownItem,
} from "./_components/MedicationActions";

export default function AdminMedicationsPage(){
    return (
    <>
    <div className="flex justify-between items-center gap-4">
        <PageHeader>Medications</PageHeader>
        <Button asChild>
            <Link href="/admin/medications/new">Add Medication</Link>
        </Button>
    </div>
    <MedicationsTable />
    </>
    )
}

async function MedicationsTable(){
    const medications = await db.medication.findMany({
        select: {
            id: true,
            name: true,
            priceInShillings: true,
            quantity: true,
            isAvailableForPurchase: true,
            _count: { select: { orders: true } },
        },
        orderBy: {name: "asc"},
    })
    if (medications.length === 0) return <p>No meds found at Utibu Health</p>

    return (
        <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medications.map(medication => (
          <TableRow key={medication.id}>
            <TableCell>
              {medication.isAvailableForPurchase ? (
                <>
                  <span className="sr-only">Available</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <span className="sr-only">Unavailable</span>
                  <XCircle className="stroke-destructive" />
                </>
              )}
            </TableCell>
            <TableCell>{medication.name}</TableCell>
            <TableCell>{formatCurrency(medication.priceInShillings)}</TableCell>
            <TableCell>{formatNumber(medication._count.orders)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a download href={`/admin/medications/${medication.id}/download`}>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/medications/${medication.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <ActiveToggleDropdownItem
                    id={medication.id}
                    isAvailableForPurchase={medication.isAvailableForPurchase}
                  />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem
                    id={medication.id}
                    disabled={medication._count.orders > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    )
}