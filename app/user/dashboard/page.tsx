import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserTickets } from "@/app/actions/user-tickets";
import { CreateTicketForm } from "@/components/CreateTicketForm";
import { UserTicketsTable } from "@/components/UserTicketsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketIcon, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function UserDashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { tickets } = await getUserTickets(session.user.id);

    // Calcular estadísticas
    const stats = {
        total: tickets?.length || 0,
        abiertos: tickets?.filter((t: any) => t.estado === "Abierto").length || 0,
        enProgreso: tickets?.filter((t: any) => t.estado === "En Progreso").length || 0,
        resueltos: tickets?.filter((t: any) => t.estado === "Resuelto" || t.estado === "Cerrado").length || 0,
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Mis Tickets</h1>
                    <p className="text-muted-foreground mt-2">
                        Gestiona tus solicitudes de soporte técnico
                    </p>
                </div>
                <CreateTicketForm userId={session.user.id} />
            </div>

            {/* Estadísticas */}
            <div className="grid gap-4 md:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                        <TicketIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            Tickets creados
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Abiertos</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.abiertos}</div>
                        <p className="text-xs text-muted-foreground">
                            Pendientes de atención
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.enProgreso}</div>
                        <p className="text-xs text-muted-foreground">
                            Siendo atendidos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resueltos}</div>
                        <p className="text-xs text-muted-foreground">
                            Completados
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de tickets */}
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Tickets</CardTitle>
                    <CardDescription>
                        Revisa el estado de todas tus solicitudes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserTicketsTable tickets={tickets || []} />
                </CardContent>
            </Card>
        </div>
    );
}
