import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUsersByAdmin } from "@/app/actions/admin-users";
import { RegisterUserForm } from "@/components/RegisterUserForm";
import { UsersTable } from "@/components/UsersTable";

export default async function AdminUsersPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Obtener los usuarios registrados por este admin
    const { users } = await getUsersByAdmin(session.user.id);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Mis Usuarios</h1>
                    <p className="text-muted-foreground mt-2">
                        Gestiona los usuarios que has registrado en el sistema
                    </p>
                </div>
                <RegisterUserForm
                    adminId={session.user.id}
                />
            </div>

            <div className="bg-card rounded-lg border p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">
                        Usuarios Registrados ({users?.length || 0})
                    </h2>
                </div>

                <UsersTable users={users || []} adminId={session.user.id} />
            </div>
        </div>
    );
}
