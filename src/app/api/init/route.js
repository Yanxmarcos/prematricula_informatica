import { initializeSessionCleanup } from '@/lib/cleanupSessions'
import { currentUser, unauthorized } from '@/lib/authorization'

export async function GET() {
  if (!await currentUser(['secretaria', 'director'])) return unauthorized();
  try {
    await initializeSessionCleanup()
    return new Response(JSON.stringify({ message: 'Limpieza de sesiones iniciada' }), {
      status: 200,
    })
  } catch (error) {
    console.error('Error inicializando limpieza:', error)
    return new Response(JSON.stringify({ error: 'Error inicializando' }), {
      status: 500,
    })
  }
}
