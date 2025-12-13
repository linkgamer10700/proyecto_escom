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
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, TicketIcon, ToggleLeft, ToggleRight } from "lucide-react";
import { toggleUserStatus } from "@/app/actions/admin-users";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    nombre: string;
    correo: string;
    telefono: string | null;
    activo: boolean;
    creado_en: Date;
    rol: { nombre: string };
    departamento: { nombre: string } | null;
    _count: {
        ticketsCreados: number;
    };
}

interface UsersTableProps {
    users: User[];
    adminId: string;
}

export function UsersTable({ users, adminId }: UsersTableProps) {
    const router = useRouter();
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

    const handleToggleStatus = async (userId: string) => {
        setLoadingUserId(userId);
        await toggleUserStatus(userId, adminId);
        router.refresh();
        setLoadingUserId(null);
    };

    if (users.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">
                    No has registrado ningún usuario aún. Usa el botón "Registrar Usuario" para comenzar.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Tickets</TableHead>
                        <TableHead>Fecha Registro</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div>
                                    <div className="font-medium">{user.nombre}</div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Mail className="h-3 w-3" />
                                        {user.correo}
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                {user.telefono ? (
                                    <div className="flex items-center gap-1 text-sm">
                                        <Phone className="h-3 w-3" />
                                        {user.telefono}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Sin teléfono</span>
                                )}
                            </TableCell>

                            <TableCell>
                                <Badge variant={user.activo ? "default" : "secondary"}>
                                    {user.activo ? "Activo" : "Inactivo"}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <TicketIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{user._count.ticketsCreados}</span>
                                    <span className="text-muted-foreground text-sm">tickets</span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(user.creado_en).toLocaleDateString("es-MX")}
                                </div>
                            </TableCell>

                            <TableCell className="text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleStatus(user.id)}
                                    disabled={loadingUserId === user.id}
                                    className="gap-2"
                                >
                                    {user.activo ? (
                                        <>
                                            <ToggleLeft className="h-4 w-4" />
                                            Desactivar
                                        </>
                                    ) : (
                                        <>
                                            <ToggleRight className="h-4 w-4" />
                                            Activar
                                        </>
                                    )}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
