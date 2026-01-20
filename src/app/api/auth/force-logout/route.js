import { SessionService } from "@/lib/sessionService"

export async function POST(request) {
  try {
    const { sessionToken } = await request.json()

    if (!sessionToken) {
      return new Response(JSON.stringify({ error: "Session token requerido" }), {
        status: 400,
      })
    }

    console.log('FORCE LOGOUT: Cerrando sesión:', sessionToken);

    await SessionService.closeSession(sessionToken);

    const session = await SessionService.getActiveSession(sessionToken);
    if (session?.usuarioId) {
      await SessionService.closeAllUserSessions(session.usuarioId);
      console.log(`FORCE LOGOUT: Cerradas todas las sesiones del usuario ${session.usuarioId}`);
    }

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