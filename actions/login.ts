"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { loginSchema, loginAdminSchema } from "@/lib/zod";
import { z } from "zod";

export const login = async (values: z.infer<typeof loginSchema>) => {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciales inválidas!" };
                default:
                    return { error: "Algo salió mal!" };
            }
        }
        throw error;
    }

    // Login exitoso, redirigimos manualmente
    return { success: true, redirect: "/dashboard" };
};

export const loginAdmin = async (values: z.infer<typeof loginAdminSchema>) => {
    const validatedFields = loginAdminSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciales inválidas!" };
                default:
                    return { error: "Algo salió mal!" };
            }
        }
        throw error;
    }

    // Login exitoso, redirigimos manualmente
    // Nota: No usamos redirect() aquí porque detenería la ejecución.
    // Retornamos la URL para que el cliente redirija.
    return { success: true, redirect: "/admin/dashboard" };
};
