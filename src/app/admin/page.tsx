import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import db from "@/db/db";
import { formatNumber, formatCurrency } from "@/lib/formatters";

async function getSalesData(){
    const data = await db.order.aggregate({
        _sum: {pricePaidInShillings: true},
        _count: true
    })

    return {
        amount: data._sum.pricePaidInShillings || 0,
        numberOfSales: data._count || 0,
    }
}

async function getPatientData(){   //here below, it's optimal doing so instead of doing awaits back to back
    const [patientCount, orderData] = await Promise.all([
        db.patient.count(),
        db.order.aggregate({
            _sum: {pricePaidInShillings: true},
        })
    ])

    return {
        patientCount,
        averageValuePerPatient: 
            patientCount === 0? 0 : (orderData._sum.pricePaidInShillings || 0)/ patientCount,  //avoid division by 0
    }
}

async function getMedicationData() {
    const [activeCount, inactiveCount] = await Promise.all([
      db.medication.count({ where: { isAvailableForPurchase: true } }),
      db.medication.count({ where: { isAvailableForPurchase: false } }),
    ])
  
    return { activeCount, inactiveCount }
  }

export default async function AdminDashboard(){
    const [salesData, patientData, medicationData] = await Promise.all([
        getSalesData(),
        getPatientData(),
        getMedicationData()
    ])
    


return  (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
        title="Sales" 
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders `} 
        body={formatCurrency(salesData.amount)} />

        <DashboardCard 
        title="Patients" 
        subtitle={`${formatCurrency(patientData.averageValuePerPatient)} Average Value `} 
        body={formatNumber(patientData.patientCount)} />

        <DashboardCard 
        title="Active Medications" 
        subtitle={`${formatNumber(medicationData.inactiveCount)} Inactive `} 
        body={formatNumber(medicationData.activeCount)} />
    </div>
)
}

type DashboardCardProps = {
    title: string;
    subtitle: string;
    body: string;
}

function DashboardCard({title, subtitle, body}: DashboardCardProps){
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{body}</p>
            </CardContent>
        </Card>
    )
}