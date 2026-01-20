"use client";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useApp } from "@/contexts/AppContext";
import { useSimpleSessionCheck } from '@/hooks/useSimpleSessionCheck'; 
import { LayoutDashboard , ShieldUser, Bolt, Hammer  } from 'lucide-react';

export default function AdministracionLayout({ children }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userData, isDarkMode, toggleTheme, appLoading } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useSimpleSessionCheck();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading" || appLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className={`text-2xl font-bold `}>
          Cargando...
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const getActiveTab = () => {
    if (pathname === "/administracion/inicio") return "inicio";
    if (pathname === "/administracion/dashboard") return "dashboard";
    if (pathname === "/administracion/sesiones") return "sesiones";
    if (pathname === "/administracion/gestion-academica") return "gestion-a";
    return "inicio";
  };

  const active = getActiveTab();

  const themeClasses = {
    background: isDarkMode 
      ? "bg-gray-900" 
      : "bg-gradient-to-br from-blue-50 to-indigo-100",
    text: isDarkMode ? "text-white" : "text-gray-800",
    headerBg: isDarkMode 
      ? "border-white/10 backdrop-blur bg-white/5" 
      : "border-blue-200/50 backdrop-blur bg-white/80",
    navBg: isDarkMode 
      ? "border-white/10 backdrop-blur bg-white/5" 
      : "border-blue-200/50 backdrop-blur bg-white/90",
    cardBg: isDarkMode ? "bg-gray-800" : "bg-white",
    dropdownBg: isDarkMode ? "bg-gray-800" : "bg-white",
    dropdownBorder: isDarkMode ? "border-gray-700" : "border-gray-200",
    hoverBg: isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    textPrimary: isDarkMode ? "text-cyan-400" : "text-blue-600",
  };

  return (
    <div className={`${themeClasses.background} min-h-screen ${themeClasses.text} relative transition-all duration-300`}>
      {/* Header */}
      <header className={`border-b ${themeClasses.headerBg} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-0 py-1">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-soft-bounce">
              <img src="/logo_info.webp" alt="Logo" className="w-12 h-12" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} drop-shadow transition-colors duration-300`}>
                Prematrícula Informática
              </h1>
              <p className={`text-xs ${themeClasses.textPrimary} transition-colors duration-300 font-bold`}>
                Escuela Profesional de Informática - UNT
              </p>
            </div>
          </div>

          {/* Tiempo y Toggle Tema */}
          <div className="flex items-center space-x-6 pr-6">
            <button
              onClick={toggleTheme}
              className={`
                p-3 rounded-full transition-all duration-300 transform hover:scale-110
                ${isDarkMode 
                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' 
                  : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-600'
                }
                border-2 ${isDarkMode ? 'border-yellow-400/30' : 'border-indigo-500/30'}
                hover:shadow-lg
              `}
              title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              <div className="relative w-6 h-6">
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2"/>
                    <path d="M12 20v2"/>
                    <path d="m4.93 4.93 1.41 1.41"/>
                    <path d="m17.66 17.66 1.41 1.41"/>
                    <path d="M2 12h2"/>
                    <path d="M20 12h2"/>
                    <path d="m6.34 17.66-1.41 1.41"/>
                    <path d="m19.07 4.93-1.41 1.41"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 transition-transform duration-300 rotate-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Navbar */}
      <nav className={`sticky top-0 border-b ${themeClasses.navBg} z-40 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Menú de navegación */}
          <div className="flex">
            {[
              {
                id: "inicio", 
                label: "Inicio", 
                path: "/administracion/inicio", 
                icon: (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <path d="M9 22V12h6v10" />
                  </svg>
                )
              },
              {
                id: "dashboard", 
                label: "Dashboard", 
                path: "/administracion/dashboard", 
                icon: (
                  <LayoutDashboard className="mr-1"/>
                )
              },
              {
                id: "gestion-a", 
                label: "Gestión Académica", 
                path: "/administracion/gestion-academica", 
                icon: (
                  <Hammer  className="mr-1"/>
                )
              },
              {
                id: "sesiones", 
                label: "Sesiones", 
                path: "/administracion/sesiones", 
                icon: (
                  <ShieldUser className="mr-1"/>
                )
              }
            ].map((item) => (
              <a
                key={item.id}
                href={item.path}
                className={`relative px-6 py-4 font-medium transition-all flex items-center group
                  ${active === item.id
                    ? isDarkMode ? "text-white" : "text-blue-600"
                    : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-blue-600"
                  }`}
              >
                {item.icon}
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 transition-transform 
                    ${active === item.id 
                      ? (isDarkMode ? "bg-cyan-400 scale-x-100" : "bg-blue-600 scale-x-100")
                      : (isDarkMode ? "bg-cyan-400 scale-x-0 group-hover:scale-x-100" : "bg-blue-600 scale-x-0 group-hover:scale-x-100")
                    }`}
                />
              </a>
            ))}
          </div>

          {/* Usuario */}
          <div className="flex items-center space-x-6 pr-6">
            <div className="text-right">
              <p className={`text-sm font-semibold ${themeClasses.text} transition-colors duration-300`}>
                {userData?.nombres && userData?.apellido_paterno
                  ? `${userData.nombres} ${userData.apellido_paterno} ${userData.apellido_materno || ''}`
                  : session?.user?.name || "Usuario"
                }
              </p>
              <p className={`text-xs ${themeClasses.textSecondary} capitalize transition-colors duration-300`}>
                {userData?.rol || "Estudiante"}
              </p>
            </div>
            <div className="relative group">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transform transition hover:scale-110 hover:rotate-6
                  ${isDarkMode 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 ${themeClasses.dropdownBg} rounded-lg shadow-xl border ${themeClasses.dropdownBorder} z-[100] transition-all duration-200`}>
                  <div className="py-1">
                    <button className={`flex items-center w-full px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.hoverBg} transition-colors duration-200`}>
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      Mi cuenta
                    </button>
                    <hr className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className={`flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'} transition-colors duration-200`}
                    >
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-0 pt-8">
        {children}
      </main>

      <Footer />

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}