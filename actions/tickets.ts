"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getAllTickets = async () => {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "Admin") {
        return { error: "No autorizado" };
    }

    try {
        const tickets = await prisma.ticket.findMany({
            include: {
                creadoPor: true,
                asignadoA: true,
                categoria: true,
                politicaSla: true,
                departamento: true,
            },
            orderBy: {
                creado_en: 'desc'
            }
        });
        return { success: tickets };
    } catch (error) {
        console.error("Error getting tickets:", error);
        return { error: "Error al obtener tickets" };
    }
}

export const getUserTickets = async () => {
    const session = await auth();

    if (!session || !session.user) {
        return { error: "No autorizado" };
    }

    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                creadoPorId: session.user.id
            },
            include: {
                creadoPor: true,
                asignadoA: true,
                categoria: true,
                politicaSla: true,
                departamento: true,
            },
            orderBy: {
                creado_en: 'desc'
            }
        });
        return { success: tickets };
    } catch (error) {
        console.error("Error getting user tickets:", error);
        return { error: "Error al obtener tickets" };
    }
}

export const createTicket = async (data: {
    titulo: string;
    descripcion: string;
    prioridad: string;
    categoriaId?: string;
}) => {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return { error: "No autorizado" };
    }

    const { titulo, descripcion, prioridad, categoriaId } = data;

    if (!titulo || !descripcion || !prioridad) {
        return { error: "Faltan campos requeridos" };
    }

    // Generar número de ticket simple (se podría mejorar)
    const count = await prisma.ticket.count();
    const numeroTicket = `TKT-${String(count + 1).padStart(5, '0')}`;

    try {
        const ticket = await prisma.ticket.create({
            data: {
                numeroTicket,
                titulo,
                descripcion,
                prioridad,
                estado: "Abierto",
                categoriaId,
                creadoPorId: session.user.id,
            }
        });

        revalidatePath("/dashboard");
        return { success: ticket };
    } catch (error) {
        console.error("Error creating ticket:", error);
        return { error: "Error al crear el ticket" };
    }
}

export const getTicketById = async (id: string) => {
    const session = await auth();

    if (!session || !session.user) {
        return { error: "No autorizado" };
    }

    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                creadoPor: true,
                asignadoA: true,
                categoria: true,
                politicaSla: true,
                departamento: true,
                comentarios: {
                    include: {
                        usuario: true,
                        archivosAdjuntos: true
                    },
                    orderBy: {
                        creado_en: 'asc'
                    }
                },
                historialTickets: {
                    include: {
                        usuario: true
                    },
                    orderBy: {
                        creado_en: 'desc'
                    }
                }
            }
        });

        if (!ticket) {
            return { error: "Ticket no encontrado" };
        }

        return { success: ticket };
    } catch (error) {
        console.error("Error getting ticket:", error);
        return { error: "Error al obtener el ticket" };
    }
}

export const updateTicketStatus = async (id: string, estado: string) => {
    const session = await auth();

    if (!session || !session.user) {
        return { error: "No autorizado" };
    }

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket) return { error: "Ticket no encontrado" };

        const updateData: any = { estado };

        if (estado === "Resuelto") {
            updateData.resueltoEn = new Date();
        }
        if (estado === "Cerrado") {
            updateData.cerradoEn = new Date();
        }

        // Registrar historial
        await prisma.historialTicket.create({
            data: {
                ticketId: id,
                usuarioId: session.user.id!,
                campo: "estado",
                valorAnterior: ticket.estado,
                valorNuevo: estado
            }
        });

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: updateData
        });

        revalidatePath(`/dashboard/ticket/${id}`);
        revalidatePath("/dashboard");
        return { success: updatedTicket };
    } catch (error) {
        console.error("Error updating ticket status:", error);
        return { error: "Error al actualizar estado" };
    }
}

export const updateTicketPriority = async (id: string, prioridad: string) => {
    const session = await auth();

    if (!session || !session.user) {
        return { error: "No autorizado" };
    }

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket) return { error: "Ticket no encontrado" };

        await prisma.historialTicket.create({
            data: {
                ticketId: id,
                usuarioId: session.user.id!,
                campo: "prioridad",
                valorAnterior: ticket.prioridad,
                valorNuevo: prioridad
            }
        });

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: { prioridad }
        });

        revalidatePath(`/dashboard/ticket/${id}`);
        return { success: updatedTicket };
    } catch (error) {
        console.error("Error updating ticket priority:", error);
        return { error: "Error al actualizar prioridad" };
    }
}

export const assignTicket = async (id: string, asignadoAId: string) => {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "Admin") {
        return { error: "No autorizado" };
    }

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id } });
        if (!ticket) return { error: "Ticket no encontrado" };

        await prisma.historialTicket.create({
            data: {
                ticketId: id,
                usuarioId: session.user.id!,
                campo: "asignadoA",
                valorAnterior: ticket.asignadoAId || "Sin asignar",
                valorNuevo: asignadoAId
            }
        });

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: { asignadoAId }
        });

        revalidatePath(`/dashboard/ticket/${id}`);
        return { success: updatedTicket };
    } catch (error) {
        console.error("Error assigning ticket:", error);
        return { error: "Error al asignar ticket" };
    }
}
