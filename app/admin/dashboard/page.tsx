import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getAllTickets } from "@/actions/tickets"
import { TicketList } from "@/components/TicketList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
    const session = await auth()

    if (!session || session.user.role !== "Admin") {
        redirect("/login")
    }

    const ticketsResult = await getAllTickets();
    const tickets = ticketsResult.success || [];

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard de Administrador</h1>
                    <p className="text-muted-foreground">Bienvenido, {session.user?.name || session.user?.email}</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tickets.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Abiertos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {tickets.filter((t: any) => t.estado === 'Abierto').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {tickets.filter((t: any) => t.estado === 'En Progreso').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {tickets.filter((t: any) => t.prioridad === 'Urgente').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tickets Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <TicketList tickets={tickets} />
                </CardContent>
            </Card>
        </div>
    )
}
