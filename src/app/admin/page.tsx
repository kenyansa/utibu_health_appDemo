import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import db from "@/db/db";

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

export default async function AdminDashboard(){
    const salesData = await getSalesData();
    
return  (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard title="Sales" subtitle={salesData.numberOfSales} body={salesData.amount} />
    </div>
)
}

type DashboardCardProps = {
    title: string;
    subtitle: number;
    body: number;
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