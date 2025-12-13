import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login/loginUser")
    }

    // Obtener el usuario completo con su rol
    const usuario = await prisma.usuario.findUnique({
        where: { id: session.user.id },
        include: { rol: true }
    })

    if (!usuario) {
        redirect("/login/loginUser")
    }

    // Redirigir según el rol
    const rolNombre = usuario.rol.nombre.toLowerCase()

    if (rolNombre === "admin" || rolNombre === "administrador") {
        redirect("/admin/dashboard")
    } else {
        redirect("/user/dashboard")
    }
}
