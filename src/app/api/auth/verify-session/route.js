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

    // console.log('Verificando sesión:', sessionToken);

    const activeSession = await prisma.session.findFirst({
      where: {
        sessionToken: sessionToken,
        usuarioId: Number(userSession.user.id),
        activa: true,
        expires: { gt: new Date() }
      }
    })

    // console.log('Resultado verificación:', activeSession ? 'VÁLIDA' : 'INVÁLIDA');

    if (!activeSession) {
      return new Response(JSON.stringify({ 
        valid: false,
        message: "Sesión expirada o cerrada" 
      }), {
        status: 401,
      })
    }

    return new Response(JSON.stringify({ 
      valid: true,
      expires: activeSession.expires
    }), {
      status: 200,
    })

  } catch (error) {
    console.error("Error verificando sesión:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
    })
  }
}
