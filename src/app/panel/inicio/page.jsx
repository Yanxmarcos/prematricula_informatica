"use client";
import { useState, useEffect, useRef } from "react";
import { useApp } from '@/contexts/AppContext';

export default function InicioPage() {
  const { userData, isDarkMode, toggleTheme } = useApp();
  const [fechasAcademicas, setFechasAcademicas] = useState({
    semestre: null,
    prematricula: null
  });
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    "/Informatica-Logo-Grande.jpg",
    "/Imagen2.jpg", 
    "/Imagen3.jpg",
    "/Imagen4.jpg",
    "/Imagen5.jpg"
  ];

  // Función para obtener fechas académicas
  const fetchFechasAcademicas = async () => {
    try {
      const response = await fetch('/api/fechas-academicas');
      const data = await response.json();

      if (data.success) {
        setFechasAcademicas(data.data);
      }
    } catch (error) {
      console.error('Error fetching academic dates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFechasAcademicas();
  }, []);

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No definida';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
    });
  };

  const getDiaMes = (fecha) => {
    if (!fecha) return { dia: '--', mes: '---' };
    const date = new Date(fecha);
    return {
      dia: date.getDate().toString().padStart(2, '0'),
      mes: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()
    };
  };

  // Clases dinámicas basadas en el tema
  const themeClasses = {
    semesterCardBg: isDarkMode
      ? "border-white/10 bg-slate-800"
      : "border-blue-700 bg-[#F2FAFF] shadow-lg",
    prematriculaCardBg: isDarkMode
      ? "border-white/10 bg-slate-800"
      : "border-[#00A800] bg-[#FFFFFF] shadow-md",
    mallasCardBg: isDarkMode
      ? "border-blue-700 bg-slate-800/90"
      : "border-blue-700 bg-white shadow-lg",
    mallasCardBg_a: isDarkMode
      ? "border-gray-700 bg-slate-800/90"
      : "border-gray-700 bg-white shadow-lg",
    cardHover: isDarkMode
      ? "hover:bg-gradient-to-br hover:from-slate-700 hover:to-slate-600"
      : "hover:shadow-xl hover:scale-[1.02]",
    text: isDarkMode ? "text-white" : "text-slate-800",
    textSecondary: isDarkMode ? "text-gray-400" : "text-slate-600",
    textAccent: isDarkMode ? "text-cyan-400" : "text-blue-600",
    clockBg: isDarkMode
      ? "bg-slate-800/50 border border-slate-600/30"
      : "bg-white/90 border border-blue-200/50 shadow-inner",
    separatorGradient: isDarkMode
      ? "from-transparent via-slate-700 to-transparent"
      : "from-transparent via-blue-500 to-transparent",
    separatorText: isDarkMode ? "text-slate-400" : "text-blue-700",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando fechas académicas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 transition-all duration-300">
      {/* Primera sección: Prematrícula y Semestre */}
      <section className="grid lg:grid-cols-2 gap-6">
        {/* Card Prematrícula */}
        <div className={`rounded-2xl p-6 border ${themeClasses.prematriculaCardBg} ${themeClasses.cardHover} hover:scale-[1.01] transition-all duration-300`}>
          <div className="flex justify-between mb-4">
            <h2 className={`text-xl font-bold flex items-center ${themeClasses.text}`}>
              PREMATRÍCULA ACADÉMICA {fechasAcademicas.prematricula?.semestre || '2026-I'}
            </h2>
            <span className={`px-4 py-2 text-sm font-bold rounded-full border backdrop-blur-sm ${fechasAcademicas.prematricula
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30"
                : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30"
              }`}>
              {fechasAcademicas.prematricula ? 'ACTUALIZADO' : 'INACTIVO'}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`flex justify-between p-5 rounded-xl border transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 hover:bg-green-500/15'
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300/40 hover:shadow-md'
              }`}>
              <div>
                <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>Inicio de prematrícula</p>
                <p className={`text-xl font-bold ${themeClasses.text} mt-1`}>
                  {formatFecha(fechasAcademicas.prematricula?.fecha_inicio)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {getDiaMes(fechasAcademicas.prematricula?.fecha_inicio).dia}
                </p>
                <p className={`text-sm font-semibold ${themeClasses.textSecondary}`}>
                  {getDiaMes(fechasAcademicas.prematricula?.fecha_inicio).mes}
                </p>
              </div>
            </div>

            <div className={`flex justify-between p-5 rounded-xl border transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/30 hover:bg-purple-500/15'
                : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300/40 hover:shadow-md'
              }`}>
              <div>
                <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>Término de prematrícula</p>
                <p className={`text-xl font-bold ${themeClasses.text} mt-1`}>
                  {formatFecha(fechasAcademicas.prematricula?.fecha_fin)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {getDiaMes(fechasAcademicas.prematricula?.fecha_fin).dia}
                </p>
                <p className={`text-sm font-semibold ${themeClasses.textSecondary}`}>
                  {getDiaMes(fechasAcademicas.prematricula?.fecha_fin).mes}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Semestre */}
        <div className={`rounded-2xl p-6 border ${themeClasses.semesterCardBg} ${themeClasses.cardHover} hover:scale-[1.01] transition-all duration-300`}>
          <div className="flex justify-between mb-4">
            <h2 className={`text-xl font-bold flex items-center ${themeClasses.text}`}>
              SEMESTRE ACADÉMICO {fechasAcademicas.semestre?.semestre || '2026-I'}
            </h2>
            <span className={`px-4 py-2 text-sm font-bold rounded-full border backdrop-blur-sm ${fechasAcademicas.semestre
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30"
                : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30"
              }`}>
              {fechasAcademicas.semestre ? 'ACTUALIZADO' : 'INACTIVO'}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`flex justify-between p-5 rounded-xl border transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 hover:bg-cyan-500/15'
                : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300/40 hover:shadow-md'
              }`}>
              <div>
                <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>Inicio de clases</p>
                <p className={`text-xl font-bold ${themeClasses.text} mt-1`}>
                  {formatFecha(fechasAcademicas.semestre?.fecha_inicio)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                  {getDiaMes(fechasAcademicas.semestre?.fecha_inicio).dia}
                </p>
                <p className={`text-sm font-semibold ${themeClasses.textSecondary}`}>
                  {getDiaMes(fechasAcademicas.semestre?.fecha_inicio).mes}
                </p>
              </div>
            </div>

            <div className={`flex justify-between p-5 rounded-xl border transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/30 hover:bg-purple-500/15'
                : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300/40 hover:shadow-md'
              }`}>
              <div>
                <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>Término de clases</p>
                <p className={`text-xl font-bold ${themeClasses.text} mt-1`}>
                  {formatFecha(fechasAcademicas.semestre?.fecha_fin)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`}>
                  {getDiaMes(fechasAcademicas.semestre?.fecha_fin).dia}
                </p>
                <p className={`text-sm font-semibold ${themeClasses.textSecondary}`}>
                  {getDiaMes(fechasAcademicas.semestre?.fecha_fin).mes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Separador alineado a la izquierda */}
      <div className="flex items-center my-8">
        <div className="text-left">
          <h3 className={`text-2xl font-bold ${themeClasses.separatorText}`}>
            Acerca del sistema
          </h3>
          <p className={`text-sm ${themeClasses.textSecondary} mt-1`}>
            Descripción general
          </p>
        </div>
        <div className={`flex-grow h-px ml-6 bg-gradient-to-r ${themeClasses.separatorGradient}`}></div>
      </div>

      {/* Sección Informativa con Carrusel */}
      <section className="my-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Carrusel de Imágenes */}
          <div className="w-full lg:w-2/5">
            <div className={`relative rounded-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-blue-200'} shadow-lg`}>
              <div className="relative h-80 overflow-hidden">
                {/* Imagen actual del carrusel */}
                <img
                  src={images[currentImageIndex]}
                  alt="Sistema de Prematrícula Informática UNT"
                  className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Indicadores del carrusel */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => goToImage(index)}
                    ></button>
                  ))}
                </div>

                <div className="absolute bottom-8 left-0 right-0 text-center text-white px-4">
                  <h3 className="text-xl font-bold">Prematricula</h3>
                  <p className="text-sm opacity-90">Escuela de Informática</p>
                </div>
              </div>
            </div>
          </div>

          {/* Texto informativo */}
          <div className="w-full lg:w-3/5">
            <h2 className={`text-3xl font-bold mb-4 ${themeClasses.text}`}>
              Prematrículas Escuela de Informática
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                UNT
              </span>
            </h2>

            <div className="space-y-4">
              <p className={`text-lg leading-relaxed ${themeClasses.textSecondary}`}>
                Este sistema está diseñado específicamente para la <span className={`font-semibold ${themeClasses.textAccent}`}>prematrícula de la Escuela de Ingeniería Informática</span>, permitiendo una gestión eficiente y centralizada.
              </p>

              <p className={`text-lg leading-relaxed ${themeClasses.textSecondary}`}>
                Nuestro sistema permite contabilizar y analizar datos de prematrícula, facilitando la toma de decisiones informadas para la planificación de cada semestre.
              </p>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-blue-50'} border ${isDarkMode ? 'border-slate-700' : 'border-blue-200'}`}>
                <p className={`text-lg leading-relaxed ${themeClasses.textSecondary}`}>
                  Gracias al sistema, la secretaria y director de escuela pueden gestionar de forma óptima la <span className={`font-semibold ${themeClasses.textAccent}`}>carga académica</span>, definir los <span className={`font-semibold ${themeClasses.textAccent}`}>cupos por salón</span> y organizar los <span className={`font-semibold ${themeClasses.textAccent}`}>horarios</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separador alineado a la izquierda */}
      <div className="flex items-center my-8">
        <div className="text-left">
          <h3 className={`text-2xl font-bold ${themeClasses.separatorText}`}>
            Mallas Curriculares
          </h3>
          <p className={`text-sm ${themeClasses.textSecondary} mt-1`}>
            Planes de estudios
          </p>
        </div>
        <div className={`flex-grow h-px ml-6 bg-gradient-to-r ${themeClasses.separatorGradient}`}></div>
      </div>

      {/* Sección de mallas curriculares */}
      <section className="grid lg:grid-cols-2 gap-6">
        {/* Card Malla Curricular 1997 */}
        <div className={`rounded-2xl p-6 border ${themeClasses.mallasCardBg_a} ${themeClasses.cardHover} hover:scale-[1.02] transition-all duration-300 flex flex-col`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-600 to-gray-600 shadow-gray-900/20'
                : 'bg-gradient-to-br from-gray-400 to-gray-400 shadow-gray-600/20'
              }`}>
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 
                011 1v2a1 1 0 01-1 1H4a1 1 0 
                01-1-1V4zM3 10a1 1 0 011-1h6a1 
                1 0 011 1v6a1 1 0 01-1 1H4a1 
                1 0 01-1-1v-6zM14 9a1 1 0 
                00-1 1v6a1 1 0 001 1h2a1 1 
                0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${themeClasses.text}`}>Currícula Antigua</h2>
              <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>Plan de estudios 1997</p>
            </div>
          </div>

          <a
            href="https://inf.unitru.edu.pe/curriculos-97"
            title="Ver Currícula Antigua 1997"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg mt-auto block text-center ${isDarkMode
                ? 'bg-gradient-to-r from-gray-700 to-gray-700 text-white hover:from-gray-600 hover:to-gray-600 shadow-lg shadow-gray-900/20'
                : 'bg-gradient-to-r from-gray-500 to-gray-500 text-white hover:from-gray-400 hover:to-gray-400 shadow-lg shadow-gray-600/20'
              }`}
          >
            <span className="flex items-center justify-center">
              Explorar Currícula Antigua
              <svg
                className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </a>
        </div>

        {/* Card Malla Curricular 2018 */}
        <div className={`rounded-2xl p-6 border ${themeClasses.mallasCardBg} ${themeClasses.cardHover} hover:scale-[1.02] transition-all duration-300 flex flex-col`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-900/20'
                : 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-blue-600/20'
              }`}>
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 
                011 1v2a1 1 0 01-1 1H4a1 1 0 
                01-1-1V4zM3 10a1 1 0 011-1h6a1 
                1 0 011 1v6a1 1 0 01-1 1H4a1 
                1 0 01-1-1v-6zM14 9a1 1 0 
                00-1 1v6a1 1 0 001 1h2a1 1 
                0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${themeClasses.text}`}>Currícula Vigente</h2>
              <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>Plan de estudios 2018</p>
            </div>
          </div>

          <a
            href="https://inf.unitru.edu.pe/curriculos"
            title="Ver Currícula Vigente 2018"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg mt-auto block text-center ${isDarkMode
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/20'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400 shadow-lg shadow-blue-600/20'
              }`}
          >
            <span className="flex items-center justify-center">
              Explorar Currícula Vigente
              <svg
                className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}