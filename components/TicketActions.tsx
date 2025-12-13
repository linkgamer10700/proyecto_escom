"use client";

import { useTransition } from "react";
import {
    updateTicketStatus,
    updateTicketPriority,
    assignTicket
} from "@/actions/tickets";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, AlertCircle, UserPlus, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface TicketActionsProps {
    ticketId: string;
    currentStatus: string;
    currentPriority: string;
    currentAssigneeId?: string | null;
}

export function TicketActions({
    ticketId,
    currentStatus,
    currentPriority
}: TicketActionsProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleStatusChange = (status: string) => {
        startTransition(async () => {
            await updateTicketStatus(ticketId, status);
            router.refresh();
        });
    };

    const handlePriorityChange = (priority: string) => {
        startTransition(async () => {
            await updateTicketPriority(ticketId, priority);
            router.refresh();
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>Cambiar Estado</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={currentStatus} onValueChange={handleStatusChange}>
                            <DropdownMenuRadioItem value="Abierto">Abierto</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="En Progreso">En Progreso</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Resuelto">Resuelto</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Cerrado">Cerrado</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>Cambiar Prioridad</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={currentPriority} onValueChange={handlePriorityChange}>
                            <DropdownMenuRadioItem value="Baja">Baja</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Media">Media</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Alta">Alta</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Urgente">Urgente</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* TODO: Add assign logic passing users list */}
                {/* <DropdownMenuItem onClick={() => {}}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Asignar</span>
                </DropdownMenuItem> */}

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
