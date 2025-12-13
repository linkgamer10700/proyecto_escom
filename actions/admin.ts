"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/zod";
import { auth } from "@/auth";

export const createUsuario = async (values: z.infer<typeof registerSchema>) => {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "Admin") {
        return { error: "No autorizado" };
    }

    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" };
    }

    const { email, password, name, phone } = validatedFields.data;

    const existingUser = await prisma.usuario.findUnique({
        where: {
            correo: email,
        },
    });

    if (existingUser) {
        return { error: "El correo ya está en uso!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = await prisma.rol.findUnique({ where: { nombre: "Usuario" } });

    if (!userRole) {
        return { error: "Error interno: Rol 'Usuario' no encontrado." };
    }

    await prisma.usuario.create({
        data: {
            nombre: name,
            correo: email,
            contrasena: hashedPassword,
            telefono: phone,
            rolId: userRole.id,
            emailVerificado: true,
            activo: true
        },
    });

    return { success: "Usuario creado exitosamente!" };
};

export const getUsuarios = async () => {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "Admin") {
        return { error: "No autorizado" };
    }

    try {
        const usuarios = await prisma.usuario.findMany({
            include: {
                rol: true,
                departamento: true
            },
            orderBy: {
                creado_en: 'desc'
            }
        });
        return { success: usuarios };
    } catch (error) {
        console.error("Error getting users:", error);
        return { error: "Error al obtener usuarios" };
    }
}
