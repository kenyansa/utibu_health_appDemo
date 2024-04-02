import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic" //opt-out of the Next.js Data Cache for admin pages

export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return <>
    <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/medications">Medications</NavLink>
        <NavLink href="/admin/patients">Patients</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
    </Nav>
    <div className="container my-6">{children}</div>
    </>
}