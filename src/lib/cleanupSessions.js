import { SessionService } from './sessionService'

export async function initializeSessionCleanup() {
  try {
    const cleanedCount = await SessionService.cleanExpiredSessions()
    
    // Configurar limpieza periódica solo en producción
    if (process.env.NODE_ENV === 'production') {
      setInterval(async () => {
        try {
          await SessionService.cleanExpiredSessions()
        } catch (error) {
          console.error('Error en limpieza periódica de sesiones:', error)
        }
      }, 60 * 60 * 1000) // Cada hora
    }
  } catch (error) {
    console.error('Error en limpieza inicial de sesiones:', error)
  }
}