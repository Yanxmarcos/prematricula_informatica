import { prisma } from './prisma'

export async function cleanExpiredSessions() {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        OR: [
          { expires: { lt: new Date() } },
          { activa: false }
        ]
      }
    })
    
    return result.count
  } catch (error) {
    console.error('Error limpiando sesiones:', error)
    return 0
  }
}

// Ejecutar limpieza cada hora
if (process.env.NODE_ENV === 'production') {
  setInterval(cleanExpiredSessions, 60 * 60 * 1000) // Cada hora
}