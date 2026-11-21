import { prisma } from "@/lib/prisma"
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request) {
  try {
    const userSession = await getServerSession(authOptions)
    const { sessionToken } = await request.json()

    if (!sessionToken || sessionToken !== userSession?.sessionToken) {
      return new Response(JSON.stringify({ error: "Session token requerido" }), {
        status: 401,
      })
    }

    await prisma.session.updateMany({
      where: { 
        sessionToken,
        usuarioId: Number(userSession.user.id),
        activa: true 
      },
      data: { 
        activa: false,
        expires: new Date()
      }
    })

    return new Response(JSON.stringify({ 
      message: "Sesión cerrada exitosamente"
    }), {
      status: 200,
    })

  } catch (error) {
    console.error("Error cerrando sesión:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
    })
  }
}
