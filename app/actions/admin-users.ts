"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

interface RegisterUserData {
    nombre: string;
    correo: string;
    contrasena: string;
    telefono?: string;
    departamentoId?: string;
}

export async function registerUserByAdmin(
    adminId: string,
    userData: RegisterUserData
) {
    try {
        // Verificar que el admin existe y tiene rol de admin
        const admin = await prisma.usuario.findUnique({
            where: { id: adminId },
            include: { rol: true }
        });

        if (!admin) {
            return { success: false, error: "Admin no encontrado" };
        }

        // Verificar que el correo no exista
        const existingUser = await prisma.usuario.findUnique({
            where: { correo: userData.correo }
        });

        if (existingUser) {
            return { success: false, error: "El correo ya está registrado" };
        }

        // Obtener el rol de "Usuario" (no admin)
        const userRole = await prisma.rol.findFirst({
            where: { nombre: { in: ["Usuario", "usuario", "USER"] } }
        });

        if (!userRole) {
            return { success: false, error: "Rol de usuario no encontrado" };
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(userData.contrasena, 10);

        // Crear el usuario
        const newUser = await prisma.usuario.create({
            data: {
                nombre: userData.nombre,
                correo: userData.correo,
                contrasena: hashedPassword,
                telefono: userData.telefono,
                departamentoId: userData.departamentoId,
                rolId: userRole.id,
                adminId: adminId, // Vincular con el admin que lo registró
                activo: true,
                emailVerificado: false,
            },
            include: {
                rol: true,
                departamento: true,
                adminQueLoRegistro: {
                    select: {
                        id: true,
                        nombre: true,
                        correo: true
                    }
                }
            }
        });

        revalidatePath("/admin/usuarios");

        return {
            success: true,
            user: {
                id: newUser.id,
                nombre: newUser.nombre,
                correo: newUser.correo,
                telefono: newUser.telefono,
                rol: newUser.rol.nombre,
                departamento: newUser.departamento?.nombre,
                adminQueLoRegistro: newUser.adminQueLoRegistro?.nombre,
            }
        };
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return { success: false, error: "Error al registrar el usuario" };
    }
}

export async function getUsersByAdmin(adminId: string) {
    try {
        const users = await prisma.usuario.findMany({
            where: {
                adminId: adminId,
            },
            include: {
                rol: true,
                departamento: true,
                _count: {
                    select: {
                        ticketsCreados: true
                    }
                }
            },
            orderBy: {
                creado_en: "desc"
            }
        });

        return { success: true, users };
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return { success: false, error: "Error al obtener usuarios", users: [] };
    }
}

export async function getTicketsByUserAdmin(adminId: string) {
    try {
        // Obtener todos los tickets de los usuarios registrados por este admin
        const tickets = await prisma.ticket.findMany({
            where: {
                creadoPor: {
                    adminId: adminId
                }
            },
            include: {
                creadoPor: {
                    select: {
                        id: true,
                        nombre: true,
                        correo: true
                    }
                },
                asignadoA: {
                    select: {
                        id: true,
                        nombre: true,
                        correo: true
                    }
                },
                categoria: true,
                departamento: true
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

export async function toggleUserStatus(userId: string, adminId: string) {
    try {
        // Verificar que el usuario pertenece al admin
        const user = await prisma.usuario.findFirst({
            where: {
                id: userId,
                adminId: adminId
            }
        });

        if (!user) {
            return { success: false, error: "Usuario no encontrado o no autorizado" };
        }

        // Toggle status
        const updatedUser = await prisma.usuario.update({
            where: { id: userId },
            data: { activo: !user.activo }
        });

        revalidatePath("/admin/usuarios");

        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        return { success: false, error: "Error al cambiar estado del usuario" };
    }
}
