import { SessionService } from "@/lib/sessionService"
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

    await SessionService.closeSession(sessionToken);

    return new Response(JSON.stringify({ 
      success: true,
      message: "Sesión cerrada forzadamente"
    }), {
      status: 200,
    })

  } catch (error) {
    console.error("Error en force-logout:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
    })
  }
}
