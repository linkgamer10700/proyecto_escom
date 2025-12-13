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
import { MessageSquare, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Ticket {
    id: string;
    numeroTicket: string;
    titulo: string;
    estado: string;
    prioridad: string;
    creado_en: Date;
    asignadoA: {
        nombre: string;
        correo: string;
    } | null;
    categoria: {
        nombre: string;
        color: string | null;
    } | null;
    _count: {
        comentarios: number;
    };
}

interface UserTicketsTableProps {
    tickets: Ticket[];
}

export function UserTicketsTable({ tickets }: UserTicketsTableProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Urgente": return "destructive";
            case "Alta": return "destructive";
            case "Media": return "default";
            case "Baja": return "secondary";
            default: return "outline";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Resuelto": return "default";
            case "Cerrado": return "secondary";
            case "En Progreso": return "default";
            default: return "outline";
        }
    };

    if (tickets.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground mb-4">
                    No tienes ningún ticket creado aún.
                </p>
                <p className="text-sm text-muted-foreground">
                    Usa el botón "Crear Ticket" para reportar un problema o hacer una solicitud.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Número</TableHead>
                        <TableHead>Asunto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Prioridad</TableHead>
                        <TableHead>Asignado a</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell className="font-medium font-mono text-sm">
                                {ticket.numeroTicket}
                            </TableCell>

                            <TableCell>
                                <div>
                                    <div className="font-medium">{ticket.titulo}</div>
                                    {ticket.categoria && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: ticket.categoria.color || "#gray" }}
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {ticket.categoria.nombre}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                <Badge variant={getStatusColor(ticket.estado)}>
                                    {ticket.estado}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <Badge variant={getPriorityColor(ticket.prioridad) as any}>
                                    {ticket.prioridad}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                {ticket.asignadoA ? (
                                    <div className="flex items-center gap-1 text-sm">
                                        <User className="h-3 w-3 text-muted-foreground" />
                                        {ticket.asignadoA.nombre}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Sin asignar</span>
                                )}
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(ticket.creado_en).toLocaleDateString("es-MX")}
                                </div>
                            </TableCell>

                            <TableCell className="text-right">
                                <Link href={`/user/tickets/${ticket.id}`}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <MessageSquare className="h-3 w-3" />
                                        Ver detalles
                                        {ticket._count.comentarios > 0 && (
                                            <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                                                {ticket._count.comentarios}
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
