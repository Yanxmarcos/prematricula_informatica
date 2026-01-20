'use client';

import { useEffect } from 'react';

export default function SessionCleanupInitializer() {
  useEffect(() => {
    // Inicializar limpieza cuando el componente se monte
    const initializeCleanup = async () => {
      try {
        const response = await fetch('/api/init');
        if (response.ok) {
          console.log('Limpieza de sesiones inicializada');
        }
      } catch (error) {
        console.error('Error inicializando limpieza:', error);
      }
    };

    initializeCleanup();
  }, []);

  return null; // Este componente no renderiza nada
}