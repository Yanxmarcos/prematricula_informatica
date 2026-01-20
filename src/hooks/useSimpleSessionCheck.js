import { useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'

export function useSimpleSessionCheck() {
  const { data: session, status } = useSession()
  const isChecking = useRef(false)

  useEffect(() => {
    const checkSession = async () => {
      if (isChecking.current || status !== 'authenticated') return;
      
      if (session?.sessionToken) {
        isChecking.current = true;

        try {
          console.log('Verificando sesión...');
          const response = await fetch('/api/auth/verify-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken: session.sessionToken }),
          })

          if (!response.ok) {
            console.log('Sesión invalidada, cerrando...');
            await signOut({ 
              redirect: true,
              callbackUrl: '/?error=SessionExpired&message=Tu+sesión+ha+sido+cerrada'
            });
          } else {
            console.log('Sesión válida');
          }
        } catch (error) {
          console.error('Error verificando sesión:', error);
        } finally {
          isChecking.current = false;
        }
      }
    }

    // Verificar cada 25 segundos
    const interval = setInterval(checkSession, 25000);
    checkSession();

    return () => clearInterval(interval);
  }, [session, status])
}