import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import db from "@/db/db"
  import { formatCurrency, formatNumber } from "@/lib/formatters"
  import { PageHeader } from "../_components/PageHeader"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { MoreVertical } from "lucide-react"
  import { DeleteDropDownItem } from "./_components/PatientActions"
  
  function getPatients() {
    return db.patient.findMany({
      select: {
        id: true,
        email: true,
        orders: { select: { pricePaidInShillings: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  }
  
  export default function PatientsPage() {
    return (
      <>
        <PageHeader>Customers</PageHeader>
        <PatientsTable />
      </>
    )
  }
  
  async function PatientsTable() {
    const patients = await getPatients()
  
    if (patients.length === 0) return <p>No customers found</p>
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map(patient => (
            <TableRow key={patient.id}>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{formatNumber(patient.orders.length)}</TableCell>
              <TableCell>
                {formatCurrency(
                  patient.orders.reduce((sum, o) => o.pricePaidInShillings + sum, 0)
                )}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DeleteDropDownItem id={patient.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }