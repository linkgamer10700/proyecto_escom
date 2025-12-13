"use client";

import { useState } from "react";
import { registerUserByAdmin } from "@/app/actions/admin-users";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

interface RegisterUserFormProps {
    adminId: string;
    onUserRegistered?: () => void;
}

export function RegisterUserForm({ adminId, onUserRegistered }: RegisterUserFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);

        const userData = {
            nombre: formData.get("nombre") as string,
            correo: formData.get("correo") as string,
            contrasena: formData.get("contrasena") as string,
            telefono: formData.get("telefono") as string || undefined,
        };

        const result = await registerUserByAdmin(adminId, userData);

        if (result.success) {
            setSuccess(`Usuario ${result.user?.nombre} registrado exitosamente`);
            setTimeout(() => {
                setOpen(false);
                setSuccess(null);
                if (onUserRegistered) {
                    onUserRegistered();
                }
                // Reset form
                (e.target as HTMLFormElement).reset();
            }, 1500);
        } else {
            setError(result.error || "Error al registrar usuario");
        }

        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Registrar Usuario
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                        Crea una cuenta para un nuevo usuario. Los tickets de este usuario quedarán vinculados a tu cuenta de administrador.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nombre">Nombre completo *</Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                placeholder="Juan Pérez"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="correo">Correo electrónico *</Label>
                            <Input
                                id="correo"
                                name="correo"
                                type="email"
                                placeholder="usuario@ejemplo.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="contrasena">Contraseña *</Label>
                            <Input
                                id="contrasena"
                                name="contrasena"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="telefono">Teléfono (opcional)</Label>
                            <Input
                                id="telefono"
                                name="telefono"
                                type="tel"
                                placeholder="5512345678"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-md">
                                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Registrando..." : "Registrar Usuario"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
