import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const { sessionToken } = await request.json()

    if (!sessionToken) {
      return new Response(JSON.stringify({ error: "Session token requerido" }), {
        status: 400,
      })
    }

    await prisma.session.updateMany({
      where: { 
        sessionToken,
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