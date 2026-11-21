import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { currentUser, unauthorized } from '@/lib/authorization'

const prisma = new PrismaClient()

export async function GET() {
  const authenticatedUser = await currentUser();
  if (!authenticatedUser) return unauthorized();
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "No autenticado" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const user = await prisma.usuario.findUnique({
      where: { correo_inst: session.user.email },
      select: {
        id: true, 
        nombres: true,
        apellido_paterno: true,
        apellido_materno: true,
        rol: true,
        codigo_estudiante: true
      }
    })

    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
