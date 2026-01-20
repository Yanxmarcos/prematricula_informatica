"use client";
import Squares from '@/components/Squares';
import { useState, useEffect } from 'react';
import Image from "next/image"
import { signIn, useSession } from "next-auth/react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    // Si ya está autenticado, redirigir según su rol
    if (status === "authenticated" && session?.user) {
      const callbackUrl = searchParams.get('callbackUrl');
      
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        // Redirigir según el rol
        if (session.user.rol === "secretaria" || session.user.rol === "director") {
          router.push('/administracion/inicio');
        } else {
          router.push('/panel/inicio');
        }
      }
    }
  }, [status, session, router, searchParams]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const callbackUrl = searchParams.get('callbackUrl') || 
        (session?.user?.rol === "secretaria" || session?.user?.rol === "director" 
          ? '/administracion/inicio' 
          : '/panel/inicio');
      
      await signIn("google", { callbackUrl, redirect: true });
    } catch (error) {
      console.error("Error during login:", error);
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando Prematrículas Informática...</div>
      </div>
    );
  }

  return (
    <div className='relative'>
      <div className='bg-gradient-to-br from-[#EBFAFF] to-[#E0F7FE] w-full h-screen overflow-hidden'>
        <Squares
          speed={0.1}
          squareSize={250}
          direction='diagonal'
          borderColor='#4A6CF7'
          hoverFillColor='#4A6CF7'
        />
      </div>
      
      {/* Contenedor de login superpuesto */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-xl shadow-lg shadow-[#4A6CF7] p-8 max-w-md w-full border-2 border-[#4A6CF7]">
          <div className="text-center mb-8">
            {/* Logo de la UNT */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-4 shadow-lg shadow-[#4A6CF7] overflow-hidden bg-gray-100 flex items-center justify-center">
              <div className="w-full h-full bg-[#fff] rounded-full flex items-center justify-center">
                <Image
                  src="/logo_info.webp"
                  alt="Logo informática UNT"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#4A6CF7] mb-2">
              Prematrícula
            </h1>
            <h2 className="text-2xl font-bold text-[#1332a2] pb-6">
              Escuela de Informática UNT
            </h2>
            
            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Información de acceso */}
            <div className="bg-gradient-to-r from-[#E0F2FE] to-[#EBFAFF] border-l-4 border-[#06B6D4] p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-[#2563EB]">
                <span className="font-semibold">
                  Dirigido para <span className='font-bold'>estudiantes</span> y <span className='font-bold'>personal administrativo</span> de la Escuela de Informática UNT.
                </span>
              </p>
            </div>
          </div>
          
          {/* Botón de acceso con correo UNT */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:from-[#1d4ed8] hover:to-[#0891b2] text-white font-semibold py-3 md:py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 mb-6 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-white rounded-full flex items-center justify-center p-0.5">
              <Image
                src="/google.svg"
                alt="Google logo"
                width={20}
                height={20}
              />
            </div>
            <span className="text-base md:text-lg">
              {isLoading ? "Cargando..." : "Acceder con Correo Institucional"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}