"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TicketActions } from "./TicketActions";

interface TicketListProps {
    tickets: any[]; // Using any for simplicity as Prisma types can be complex to import on client without generated types
}

export function TicketList({ tickets }: TicketListProps) {
    if (tickets.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No hay tickets registrados.</p>
            </div>
        );
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Urgente": return "destructive";
            case "Alta": return "destructive"; // or separate variant
            case "Media": return "default"; // or secondary
            case "Baja": return "secondary"; // or outline
            default: return "outline";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Resuelto": return "success"; // Need to ensure variant exists or use custom class
            case "Cerrado": return "secondary";
            case "En Progreso": return "default";
            default: return "outline"; // Abierto
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Asunto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Prioridad</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead>Asignado A</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.numeroTicket}</TableCell>
                            <TableCell>{ticket.titulo}</TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    {ticket.estado}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getPriorityColor(ticket.prioridad) as any}>
                                    {ticket.prioridad}
                                </Badge>
                            </TableCell>
                            <TableCell>{ticket.creadoPor?.nombre || ticket.creadoPor?.correo}</TableCell>
                            <TableCell>{ticket.asignadoA?.nombre || "Sin asignar"}</TableCell>
                            <TableCell className="text-right">
                                <TicketActions
                                    ticketId={ticket.id}
                                    currentStatus={ticket.estado}
                                    currentPriority={ticket.prioridad}
                                    currentAssigneeId={ticket.asignadoAId}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
