"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateTicketData {
    titulo: string;
    descripcion: string;
    prioridad: string;
    categoriaId?: string;
}

export async function createTicket(userId: string, data: CreateTicketData) {
    try {
        // Generar número de ticket único
        const ticketCount = await prisma.ticket.count();
        const numeroTicket = `TK-${String(ticketCount + 1).padStart(6, '0')}`;

        // Obtener el admin del usuario
        const usuario = await prisma.usuario.findUnique({
            where: { id: userId },
            include: {
                adminQueLoRegistro: true,
                departamento: true
            }
        });

        if (!usuario) {
            return { success: false, error: "Usuario no encontrado" };
        }

        const ticket = await prisma.ticket.create({
            data: {
                numeroTicket,
                titulo: data.titulo,
                descripcion: data.descripcion,
                prioridad: data.prioridad,
                estado: "Abierto",
                categoriaId: data.categoriaId,
                creadoPorId: userId,
                asignadoAId: usuario.adminId, // Asignar automáticamente al admin
                departamentoId: usuario.departamentoId,
            },
            include: {
                creadoPor: true,
                asignadoA: true,
                categoria: true
            }
        });

        revalidatePath("/user/tickets");

        return { success: true, ticket };
    } catch (error) {
        console.error("Error al crear ticket:", error);
        return { success: false, error: "Error al crear el ticket" };
    }
}

export async function getUserTickets(userId: string) {
    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                creadoPorId: userId
            },
            include: {
                creadoPor: {
                    select: {
                        nombre: true,
                        correo: true
                    }
                },
                asignadoA: {
                    select: {
                        nombre: true,
                        correo: true
                    }
                },
                categoria: true,
                _count: {
                    select: {
                        comentarios: true
                    }
                }
            },
            orderBy: {
                creado_en: "desc"
            }
        });

        return { success: true, tickets };
    } catch (error) {
        console.error("Error al obtener tickets:", error);
        return { success: false, error: "Error al obtener tickets", tickets: [] };
    }
}

export async function getTicketById(ticketId: string, userId: string) {
    try {
        const ticket = await prisma.ticket.findFirst({
            where: {
                id: ticketId,
                creadoPorId: userId // Solo puede ver sus propios tickets
            },
            include: {
                creadoPor: true,
                asignadoA: true,
                categoria: true,
                departamento: true,
                comentarios: {
                    include: {
                        usuario: {
                            select: {
                                nombre: true,
                                correo: true,
                                avatar: true
                            }
                        }
                    },
                    orderBy: {
                        creado_en: "asc"
                    }
                }
            }
        });

        if (!ticket) {
            return { success: false, error: "Ticket no encontrado" };
        }

        return { success: true, ticket };
    } catch (error) {
        console.error("Error al obtener ticket:", error);
        return { success: false, error: "Error al obtener ticket" };
    }
}

export async function addCommentToTicket(ticketId: string, userId: string, contenido: string) {
    try {
        // Verificar que el ticket pertenece al usuario
        const ticket = await prisma.ticket.findFirst({
            where: {
                id: ticketId,
                creadoPorId: userId
            }
        });

        if (!ticket) {
            return { success: false, error: "Ticket no encontrado o no autorizado" };
        }

        const comentario = await prisma.comentario.create({
            data: {
                contenido,
                ticketId,
                usuarioId: userId,
                esInterno: false
            },
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        correo: true,
                        avatar: true
                    }
                }
            }
        });

        revalidatePath(`/user/tickets/${ticketId}`);

        return { success: true, comentario };
    } catch (error) {
        console.error("Error al agregar comentario:", error);
        return { success: false, error: "Error al agregar comentario" };
    }
}

export async function getCategories() {
    try {
        const categories = await prisma.categoria.findMany({
            where: { activo: true },
            select: {
                id: true,
                nombre: true,
                color: true
            }
        });

        return { success: true, categories };
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return { success: false, error: "Error al obtener categorías", categories: [] };
    }
}
