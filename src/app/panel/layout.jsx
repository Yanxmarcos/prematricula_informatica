"use client";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useApp } from "@/contexts/AppContext";
import { useSimpleSessionCheck } from '@/hooks/useSimpleSessionCheck';
import { User, X, Save, AlertCircle, Check } from 'lucide-react';

export default function PanelLayout({ children }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  
  const { userData, isDarkMode, toggleTheme, appLoading, updateUserData } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Estado para el formulario de perfil
  const [profileData, setProfileData] = useState({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    codigo_estudiante: ''
  });

  useSimpleSessionCheck();

  // Cargar datos al abrir el modal o cambiar userData
  useEffect(() => {
    if (userData) {
      setProfileData({
        nombres: userData.nombres || '',
        apellido_paterno: userData.apellido_paterno || '',
        apellido_materno: userData.apellido_materno || '',
        codigo_estudiante: userData.codigo_estudiante || ''
      });
    }
  }, [userData, isProfileModalOpen]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // Manejadores de Inputs con Validación
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validación: Solo números para código de estudiante
    if (name === 'codigo_estudiante') {
      if (/^\d*$/.test(value) && value.length <= 11) {
        setProfileData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Validación: Solo letras y espacios para nombres/apellidos
    if (['nombres', 'apellido_paterno', 'apellido_materno'].includes(name)) {
      if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
        setProfileData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/usuario/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: userData.id,
            ...profileData
        })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      setSaveMessage({ type: 'success', text: '¡Datos actualizados correctamente!' });
      
      setTimeout(() => {
        setIsProfileModalOpen(false);
        setSaveMessage({ type: '', text: '' });
        window.location.reload();
      }, 1500);

    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Hubo un error al guardar los cambios.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || appLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className={`text-2xl font-bold `}>Cargando...</div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const getActiveTab = () => {
    if (pathname === "/panel/inicio") return "inicio";
    if (pathname === "/panel/prematriculas") return "prematricula";
    if (pathname === "/panel/historial") return "historial";
    return "inicio";
  };

  const active = getActiveTab();

  const themeClasses = {
    background: isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100",
    text: isDarkMode ? "text-white" : "text-gray-800",
    headerBg: isDarkMode ? "border-white/10 backdrop-blur bg-white/5" : "border-blue-200/50 backdrop-blur bg-white/80",
    navBg: isDarkMode ? "border-white/10 backdrop-blur bg-white/5" : "border-blue-200/50 backdrop-blur bg-white/90",
    cardBg: isDarkMode ? "bg-gray-800" : "bg-white",
    dropdownBg: isDarkMode ? "bg-gray-800" : "bg-white",
    dropdownBorder: isDarkMode ? "border-gray-700" : "border-gray-200",
    hoverBg: isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    textPrimary: isDarkMode ? "text-cyan-400" : "text-blue-600",
    inputBg: isDarkMode ? "bg-gray-700 border-gray-600 text-white focus:border-cyan-400" : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500",
    modalOverlay: "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200",
  };

  return (
    <div className={`${themeClasses.background} min-h-screen ${themeClasses.text} relative transition-all duration-300`}>
      {/* Header */}
      <header className={`border-b ${themeClasses.headerBg} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-0 py-1">
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

          <div className="flex items-center space-x-6 pr-6">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 border-2 hover:shadow-lg
                ${isDarkMode ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-400/30' : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-600 border-indigo-500/30'}
              `}
              title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
               <div className="relative w-6 h-6">
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
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
          <div className="flex">
            {[
              { id: "inicio", label: "Inicio", path: "/panel/inicio", icon: <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></svg> },
              { id: "prematricula", label: "Prematrícula", path: "/panel/prematriculas", icon: <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg> },
              { id: "historial", label: "Historial de Prematrículas", path: "/panel/historial", icon: <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg> }
            ].map((item) => (
              <a
                key={item.id}
                href={item.path}
                className={`relative px-6 py-4 font-medium transition-all flex items-center group
                  ${active === item.id ? (isDarkMode ? "text-white" : "text-blue-600") : (isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-blue-600")}
                `}
              >
                {item.icon}
                {item.label}
                <span className={`absolute bottom-0 left-0 right-0 h-0.5 transition-transform ${active === item.id ? (isDarkMode ? "bg-cyan-400 scale-x-100" : "bg-blue-600 scale-x-100") : (isDarkMode ? "bg-cyan-400 scale-x-0 group-hover:scale-x-100" : "bg-blue-600 scale-x-0 group-hover:scale-x-100")}`} />
              </a>
            ))}
          </div>

          {/* Usuario y Dropdown */}
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
                  ${isDarkMode ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}
                `}
              >
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Foto de perfil" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
                )}
              </button>

              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 ${themeClasses.dropdownBg} rounded-lg shadow-xl border ${themeClasses.dropdownBorder} z-[100] transition-all duration-200`}>
                  <div className="py-1">
                    <button 
                      onClick={() => { setIsDropdownOpen(false); setIsProfileModalOpen(true); }}
                      className={`flex items-center w-full px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.hoverBg} transition-colors duration-200`}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Mi cuenta
                    </button>
                    <hr className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className={`flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'} transition-colors duration-200`}
                    >
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-0 pt-8">
        {children}
      </main>

      <Footer />

      {/* MODAL DE MI CUENTA */}
      {isProfileModalOpen && (
        <div className={themeClasses.modalOverlay}>
          <div className={`${themeClasses.cardBg} w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transform transition-all`}>
            
            {/* Header Modal */}
            <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} flex justify-between items-center`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${themeClasses.text}`}>
                <User className="w-5 h-5 text-blue-500" />
                Mi Perfil
              </h3>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-6">
              {/* Foto de Perfil */}
              <div className="flex flex-col items-center justify-center">
                <div className={`w-24 h-24 rounded-full p-1 border-4 ${isDarkMode ? 'border-gray-700' : 'border-blue-100'} mb-3`}>
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="Perfil" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  Foto de Google
                </span>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ml-1 uppercase ${themeClasses.textSecondary}`}>Nombres</label>
                    <input
                      type="text"
                      name="nombres"
                      value={profileData.nombres}
                      onChange={handleInputChange}
                      placeholder="Ingrese sus nombres"
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${themeClasses.inputBg}`}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold mb-1 ml-1 uppercase ${themeClasses.textSecondary}`}>Apellido Paterno</label>
                      <input
                        type="text"
                        name="apellido_paterno"
                        value={profileData.apellido_paterno}
                        onChange={handleInputChange}
                        placeholder="Apellido Paterno"
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${themeClasses.inputBg}`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-bold mb-1 ml-1 uppercase ${themeClasses.textSecondary}`}>Apellido Materno</label>
                      <input
                        type="text"
                        name="apellido_materno"
                        value={profileData.apellido_materno}
                        onChange={handleInputChange}
                        placeholder="Apellido Materno"
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${themeClasses.inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1 ml-1 uppercase ${themeClasses.textSecondary}`}>Código de Estudiante</label>
                    <div className="relative">
                       <input
                        type="text"
                        name="codigo_estudiante"
                        value={profileData.codigo_estudiante}
                        onChange={handleInputChange}
                        placeholder="Ej: 1052701921"
                        maxLength={10}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono tracking-wide ${themeClasses.inputBg}`}
                        required
                      />
                       <div className="absolute right-3 top-2.5">
                          <span className="text-xs text-gray-400 font-mono">{profileData.codigo_estudiante.length}/10</span>
                       </div>
                    </div>
                  </div>

                   {/* Email*/}
                    <div>
                        <label className={`block text-xs font-bold mb-1 ml-1 uppercase ${themeClasses.textSecondary}`}>
                            Correo Institucional
                        </label>
                        <input
                            type="text"
                            // CORRECCIÓN AQUÍ: Si no hay dato en BD, usa el de la sesión de Google
                            value={userData?.correo_inst || session?.user?.email || ''} 
                            disabled
                            className={`w-full px-4 py-2 rounded-lg border opacity-60 cursor-not-allowed ${
                                isDarkMode 
                                ? 'bg-gray-900 border-gray-700 text-gray-500' 
                                : 'bg-gray-100 border-gray-200 text-gray-500'
                            }`}
                        />
                    </div>
                </div>

                {/* Mensajes de Estado */}
                {saveMessage.text && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${
                    saveMessage.type === 'success' 
                      ? (isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700')
                      : (isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700')
                  }`}>
                    {saveMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {saveMessage.text}
                  </div>
                )}

                {/* Footer Modal */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    disabled={isSaving}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex-1 px-4 py-2 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                      isSaving 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02]'
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDropdownOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
      )}
    </div>
  );
}