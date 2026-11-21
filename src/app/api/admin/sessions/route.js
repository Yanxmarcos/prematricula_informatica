import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SessionService } from "@/lib/sessionService"
import { currentUser, unauthorized } from '@/lib/authorization'

export async function GET() {
  if (!await currentUser(['secretaria', 'director'])) return unauthorized();
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.rol !== 'secretaria' && session.user.rol !== 'director')) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      })
    }

    const sessions = await prisma.session.findMany({
      where: {
        activa: true,
        expires: { gt: new Date() }
      },
      include: {
        usuario: {
          select: {
            id: true,
            correo_inst: true,
            nombres: true,
            apellido_paterno: true,
            apellido_materno: true,
            rol: true
          }
        }
      },
      orderBy: {
        expires: 'desc'
      }
    })

    return new Response(JSON.stringify(sessions.map(({ sessionToken, ...safe }) => safe)), {
      status: 200,
    })
  } catch (error) {
    console.error("Error obteniendo sesiones:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
    })
  }
}

export async function DELETE(request) {
  if (!await currentUser(['secretaria', 'director'])) return unauthorized();
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.rol !== 'secretaria' && session.user.rol !== 'director')) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "ID de sesión requerido" }), {
        status: 400,
      })
    }

    const sessionToClose = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        usuario: {
          select: {
            id: true,
            correo_inst: true,
            nombres: true
          }
        }
      }
    })

    if (!sessionToClose) {
      return new Response(JSON.stringify({ error: "Sesión no encontrada" }), {
        status: 404,
      })
    }

    // console.log('ADMIN: Cerrando sesión forzadamente:', {
    //   sessionId,
    //   usuario: sessionToClose.usuario.correo_inst,
    //   sessionToken: sessionToClose.sessionToken
    // });

    await prisma.session.updateMany({
      where: { 
        usuarioId: sessionToClose.usuarioId,
        activa: true 
      },
      data: { 
        activa: false,
        expires: new Date()
      }
    })

    // console.log(`ADMIN: Todas las sesiones cerradas forzosamente para: ${sessionToClose.usuario.correo_inst}`)

    return new Response(JSON.stringify({ 
      success: true,
      message: "Sesión cerrada exitosamente",
      usuario: sessionToClose.usuario.correo_inst,
      todasSesiones: true,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
    })
  } catch (error) {
    console.error("ADMIN: Error cerrando sesión:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
    })
  }
}

export async function POST() {
  if (!await currentUser(['secretaria', 'director'])) return unauthorized();
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.rol !== 'secretaria' && session.user.rol !== 'director')) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      })
    }

    const cleanedCount = await SessionService.cleanExpiredSessions()

    return new Response(JSON.stringify({ 
      message: `Se limpiaron ${cleanedCount} sesiones expiradas` 
    }), {
      status: 200,
    })
  } catch (error) {
    console.error("Error limpiando sesiones:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
    })
  }
}
