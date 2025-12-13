import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ThemeToggle";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-background sticky top-0 z-50">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-8">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl">
                            <span className="bg-primary text-primary-foreground p-1 rounded">TICKO</span>
                            <span>Admin</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/usuarios"
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Users className="h-4 w-4" />
                                Usuarios
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-medium">{session?.user?.name || "Administrador"}</span>
                            <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
                        </div>

                        <ModeToggle />

                        <form
                            action={async () => {
                                "use server";
                                await signOut({ redirectTo: "/" });
                            }}
                        >
                            <Button variant="ghost" size="icon" title="Cerrar Sesión">
                                <LogOut className="h-5 w-5" />
                                <span className="sr-only">Cerrar Sesión</span>
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="flex-1 bg-muted/5 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
