import { useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'

export function useSessionCheck() {
  const isChecking = useRef(false)
  const lastCheck = useRef(0)

  useEffect(() => {
    const performLogout = async (sessionToken) => {
      try {
        
        // 1-Notificar al backend que cerremos la sesión
        await fetch('/api/auth/force-logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken })
        });

        // 2-Forzar signOut de NextAuth
        await signOut({ 
          redirect: true,
          callbackUrl: '/?error=SessionExpired&message=Tu+sesión+ha+sido+cerrada+por+un+administrador'
        });

      } catch (error) {
        console.error('Error en logout forzado:', error);
        // extra si no da: redirección forzada
        window.location.href = '/?error=SessionExpired&message=Tu+sesión+ha+sido+cerrada+por+un+administrador';
      }
    };

    const checkSession = async () => {
      if (isChecking.current) return;
      
      const now = Date.now();
      if (now - lastCheck.current < 15000) return; // 15 segundos

      try {
        isChecking.current = true;
        lastCheck.current = now;

        // Obtener la sesión actual del localStorage
        const sessionData = localStorage.getItem('nextauth.message');
        if (!sessionData) {
          isChecking.current = false;
          return;
        }

        const session = JSON.parse(sessionData);
        const sessionToken = session?.sessionToken;

        if (sessionToken) {
          const response = await fetch('/api/auth/verify-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken }),
          })

          if (!response.ok) {
            console.log('Sesión invalidada, ejecutando logout...');
            await performLogout(sessionToken);
          } else {
            console.log('Sesión válida');
          }
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
      } finally {
        isChecking.current = false;
      }
    }

    // Verificar cada 20 segundos
    const interval = setInterval(checkSession, 20000);
    
    // Verificar después de 5 segundos
    const initialCheck = setTimeout(checkSession, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialCheck);
    }
  }, [])
}