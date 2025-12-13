"use client";

import { useState, useEffect } from "react";
import { createTicket, getCategories } from "@/app/actions/user-tickets";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateTicketFormProps {
    userId: string;
}

export function CreateTicketForm({ userId }: CreateTicketFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [categories, setCategories] = useState<Array<{ id: string; nombre: string }>>([]);
    const [selectedPriority, setSelectedPriority] = useState("Media");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const loadCategories = async () => {
            const result = await getCategories();
            if (result.success) {
                setCategories(result.categories);
            }
        };
        loadCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);

        const ticketData = {
            titulo: formData.get("titulo") as string,
            descripcion: formData.get("descripcion") as string,
            prioridad: selectedPriority,
            categoriaId: selectedCategory || undefined,
        };

        const result = await createTicket(userId, ticketData);

        if (result.success) {
            setSuccess("Ticket creado exitosamente");
            setTimeout(() => {
                setOpen(false);
                setSuccess(null);
                (e.target as HTMLFormElement).reset();
                setSelectedPriority("Media");
                setSelectedCategory("");
                router.refresh();
            }, 1500);
        } else {
            setError(result.error || "Error al crear ticket");
        }

        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Crear Ticket
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Ticket</DialogTitle>
                    <DialogDescription>
                        Describe tu problema o solicitud. Nuestro equipo te ayudará lo antes posible.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="titulo">Asunto *</Label>
                            <Input
                                id="titulo"
                                name="titulo"
                                placeholder="Ej: Problema con acceso al sistema"
                                required
                                disabled={loading}
                                maxLength={255}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="descripcion">Descripción del problema *</Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                placeholder="Describe detalladamente tu problema o solicitud..."
                                required
                                disabled={loading}
                                rows={5}
                                className="resize-none"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="prioridad">Prioridad *</Label>
                            <Select
                                value={selectedPriority}
                                onValueChange={setSelectedPriority}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona la prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Baja">Baja - Puede esperar</SelectItem>
                                    <SelectItem value="Media">Media - Importante</SelectItem>
                                    <SelectItem value="Alta">Alta - Urgente</SelectItem>
                                    <SelectItem value="Urgente">Urgente - Crítico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {categories.length > 0 && (
                            <div className="grid gap-2">
                                <Label htmlFor="categoria">Categoría (opcional)</Label>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

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
                            {loading ? "Creando..." : "Crear Ticket"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
