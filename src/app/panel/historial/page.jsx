"use client";
import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, GraduationCap, Clock, RotateCcw } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function HistorialPage() {
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportando, setExportando] = useState(null);
  const { userData, isDarkMode } = useApp();

  useEffect(() => {
    if (userData?.id) {
      cargarHistorial();
    }
  }, [userData]);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/prematricula/historial?userId=${userData.id}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar el historial');
      }

      const data = await response.json();
      setHistorial(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lógica para detectar repetición (Ciclo vs Semestre)
  const esCursoRepeticion = (cicloCurso, semestreActual) => {
    if (!semestreActual) return false;

    const esCicloPar = cicloCurso % 2 === 0;
    // Asumimos semestre "I", "II" o terminados en "I"/"II"
    const esSemestrePar = semestreActual === 'II' || semestreActual.endsWith('II'); 

    if (esSemestrePar) {
      // En semestre Par (II), los cursos impares son repetición
      return !esCicloPar; 
    } else {
      // En semestre Impar (I), los cursos pares son repetición
      return esCicloPar;
    }
  };

  // Clases dinámicas basadas en el tema
  const themeClasses = {
    cardBg: isDarkMode
      ? "border-white/10 bg-slate-800" 
      : "border-blue-200 bg-white shadow-lg",
    headerCardBg: isDarkMode 
      ? "border-white/10 bg-slate-800" 
      : "border-blue-200 bg-white shadow-md",
    emptyCardBg: isDarkMode 
      ? "border-white/10 bg-slate-800" 
      : "border-gray-200 bg-white shadow-md",
    cardHover: isDarkMode 
      ? "hover:bg-slate-700/50" 
      : "hover:shadow-xl hover:scale-[1.01]",
    text: isDarkMode ? "text-white" : "text-slate-800",
    textSecondary: isDarkMode ? "text-gray-400" : "text-slate-600",
    textAccent: isDarkMode ? "text-cyan-400" : "text-blue-600",
    border: isDarkMode ? "border-slate-600" : "border-gray-200",
    tableHeaderBg: isDarkMode 
      ? "bg-slate-700 border-slate-600" 
      : "bg-gray-50 border-gray-200",
    tableRowHover: isDarkMode 
      ? "hover:bg-slate-600/50" 
      : "hover:bg-gray-50",
    buttonPrimary: isDarkMode
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-600 hover:bg-red-700 text-white",
    buttonDisabled: isDarkMode
      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
      : "bg-gray-300 text-gray-500 cursor-not-allowed",
    badgeEG: isDarkMode 
      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
      : "bg-green-100 text-green-800 border border-green-300",
    badgeES: isDarkMode 
      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
      : "bg-blue-100 text-blue-800 border border-blue-300",
    badgeEE: isDarkMode 
      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
      : "bg-orange-100 text-orange-800 border border-orange-300",
    hoursBadge: isDarkMode 
      ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" 
      : "bg-blue-50 text-blue-700 border border-blue-200",
    gradientHeader: isDarkMode
      ? "bg-gradient-to-r from-blue-700 to-blue-800"
      : "bg-gradient-to-r from-blue-600 to-blue-700",
    summaryBg: isDarkMode
      ? "bg-slate-700/50 border-slate-600"
      : "bg-gray-50 border-gray-200"
  };

  const exportarPDF = async (prematricula) => {
    setExportando(prematricula.id);
    
    try {
      const ventanaPDF = window.open('', '_blank');
      
      const contenidoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Prematrícula ${prematricula.semestre}-${prematricula.anio}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
              margin: 0;
            }
            .no-print {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #2563eb;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              border: none;
              font-size: 16px;
              font-weight: bold;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            .no-print:hover {
              background: #1e40af;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1e40af;
              margin: 0;
              font-size: 24px;
            }
            .info-estudiante {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .info-estudiante p {
              margin: 5px 0;
              font-size: 14px;
            }
            .info-prematricula {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              padding: 15px;
              background-color: #eff6ff;
              border-radius: 8px;
            }
            .info-prematricula div {
              flex: 1;
            }
            .info-prematricula strong {
              color: #1e40af;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #2563eb;
              color: white;
              padding: 12px;
              text-align: left;
              font-size: 14px;
            }
            td {
              padding: 10px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 13px;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .tipo-badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .tipo-EG { background-color: #10b981; color: white; }
            .tipo-ES { background-color: #3b82f6; color: white; }
            .tipo-EE { background-color: #f59e0b; color: white; }
            .vez-badge {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: bold;
            }
            .vez-1 { background-color: #d1fae5; color: #065f46; }
            .vez-2 { background-color: #fef3c7; color: #92400e; }
            .vez-3 { background-color: #fed7aa; color: #9a3412; }
            .vez-4 { background-color: #fecaca; color: #991b1b; }
            .repeticion-badge {
              display: inline-block;
              background-color: #fee2e2;
              color: #991b1b;
              border: 1px solid #fecaca;
              font-size: 10px;
              padding: 2px 6px;
              border-radius: 10px;
              margin-left: 5px;
              font-weight: bold;
            }
            .resumen {
              margin-top: 30px;
              padding: 20px;
              background-color: #f0fdf4;
              border-left: 4px solid #10b981;
              border-radius: 8px;
            }
            .resumen h3 {
              color: #166534;
              margin-top: 0;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <button class="no-print" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
          
          <div class="header">
            <h1>CONSTANCIA DE PREMATRÍCULA</h1>
            <p>Semestre ${prematricula.semestre} - ${prematricula.anio}</p>
          </div>

          <div class="info-estudiante">
            <p><strong>Estudiante:</strong> ${historial.usuario.nombres} ${historial.usuario.apellido_paterno} ${historial.usuario.apellido_materno}</p>
            <p><strong>Código:</strong> ${historial.usuario.codigo_estudiante || 'N/A'}</p>
            <p><strong>Correo:</strong> ${historial.usuario.correo_inst}</p>
          </div>

          <div class="info-prematricula">
            <div>
              <strong>Tipo de Matrícula:</strong> ${prematricula.tipoMatricula}
            </div>
            <div>
              <strong>Fecha de Registro:</strong> ${new Date(prematricula.fechaCreacion).toLocaleDateString('es-PE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <h2 style="color: #1e40af; margin-top: 30px;">Cursos Seleccionados</h2>
          
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Ciclo</th>
                <th>Tipo</th>
                <th>N° Vez</th>
                <th>Créditos</th>
                <th>Horas (T-P-L)</th>
              </tr>
            </thead>
            <tbody>
              ${prematricula.cursos.map(curso => {
                // Calcular repetición también para el PDF
                const isRep = esCursoRepeticion(curso.ciclo, prematricula.semestre);
                return `
                <tr>
                  <td>${curso.codigo}</td>
                  <td>
                    ${curso.nombre}
                    ${isRep ? '<span class="repeticion-badge">Repetición</span>' : ''}
                  </td>
                  <td>${curso.ciclo}</td>
                  <td><span class="tipo-badge tipo-${curso.tipo}">${curso.tipo}</span></td>
                  <td>
                    <span class="vez-badge vez-${curso.numero_vez}">
                      ${curso.numero_vez === 1 ? '1era' : curso.numero_vez === 2 ? '2da' : curso.numero_vez === 3 ? '3ra' : '4ta'} vez
                    </span>
                  </td>
                  <td><strong>${curso.creditos}</strong></td>
                  <td>${curso.hrs_teoria}-${curso.hrs_practica}-${curso.hrs_lab}</td>
                </tr>
              `}).join('')}
            </tbody>
          </table>

          <div class="resumen">
            <h3>Resumen</h3>
            <p><strong>Total de Cursos:</strong> ${prematricula.totalCursos}</p>
            <p><strong>Total de Créditos:</strong> ${prematricula.totalCreditos}</p>
          </div>

          <div class="footer">
            <p>Documento generado el ${new Date().toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p>Sistema de Prematrícula Académica</p>
          </div>
        </body>
        </html>
      `;

      ventanaPDF.document.write(contenidoHTML);
      ventanaPDF.document.close();
      
      setTimeout(() => {
        ventanaPDF.print();
      }, 500);
      
    } catch (err) {
      console.error('Error al exportar:', err);
      alert('Error al exportar el documento');
    } finally {
      setExportando(null);
    }
  };

  if (loading || !userData) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-b-4 ${isDarkMode ? 'border-cyan-400' : 'border-blue-600'} mx-auto mb-4`}></div>
          <p className={themeClasses.text}>Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className={`rounded-lg p-6 max-w-md border ${
          isDarkMode 
            ? 'bg-red-900/20 border-red-800 text-red-400' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <h3 className="font-semibold mb-2">Error al cargar</h3>
          <p className={isDarkMode ? 'text-red-300' : 'text-red-600'}>{error}</p>
          <button
            onClick={cargarHistorial}
            className={`mt-4 px-4 py-2 rounded ${
              isDarkMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-2 px-4 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg p-4 mb-4 border ${themeClasses.headerCardBg}`}>
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            <h1 className={`text-xl font-bold ${themeClasses.text}`}>Historial de Prematrículas</h1>
          </div>
        </div>

        {/* Lista de Prematrículas */}
        {historial.prematriculas.length === 0 ? (
          <div className={`rounded-lg p-12 text-center border ${themeClasses.emptyCardBg}`}>
            <GraduationCap className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${themeClasses.text}`}>
              No hay prematrículas registradas
            </h3>
            <p className={themeClasses.textSecondary}>
              Aún no has realizado ninguna prematrícula
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {historial.prematriculas.map((prematricula) => (
              <div 
                key={prematricula.id} 
                className={`rounded-lg overflow-hidden border transition-all duration-300 ${themeClasses.cardBg} ${themeClasses.cardHover}`}
              >
                {/* Header de la Prematrícula */}
                <div className={`p-6 ${themeClasses.gradientHeader} text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Prematrícula Semestre {prematricula.anio} - {prematricula.semestre}
                      </h2>
                      <div className="flex items-center gap-4 text-blue-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(prematricula.fechaCreacion).toLocaleDateString('es-PE')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(prematricula.fechaCreacion).toLocaleTimeString('es-PE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">Tipo de Matrícula</p>
                      <p className="text-xl font-bold">{prematricula.tipoMatricula}</p>
                    </div>
                  </div>
                </div>

                {/* Tabla de Cursos */}
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b-2 ${themeClasses.tableHeaderBg}`}>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${themeClasses.text}`}>Código</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${themeClasses.text}`}>Nombre</th>
                          <th className={`text-center py-3 px-4 text-sm font-semibold ${themeClasses.text}`}>Ciclo</th>
                          <th className={`text-center py-3 px-4 text-sm font-semibold ${themeClasses.text}`}>Tipo</th>
                          <th className={`text-center py-3 px-4 text-sm font-semibold ${themeClasses.text}`}>N° Vez</th>
                          <th className={`text-center py-3 px-4 text-sm font-semibold ${themeClasses.text}`}>Créditos</th>
                          <th className={`text-center py-3 px-4 text-sm font-semibold ${themeClasses.text}`}>Horas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prematricula.cursos.map((curso, idx) => {
                          // Calcular si es repetición en este render
                          const esRep = esCursoRepeticion(curso.ciclo, prematricula.semestre);
                          
                          return (
                            <tr 
                              key={idx} 
                              className={`border-b ${themeClasses.border} ${themeClasses.tableRowHover}`}
                            >
                              <td className={`py-3 px-4 font-mono text-sm ${themeClasses.text}`}>{curso.codigo}</td>
                              <td className={`py-3 px-4 ${themeClasses.text}`}>
                                <div className="flex items-center gap-2">
                                  <span>{curso.nombre}</span>
                                  {/* Etiqueta de Repetición Visual */}
                                  {esRep && (
                                    <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1 font-bold whitespace-nowrap">
                                      <RotateCcw className="w-3 h-3" />
                                      Repetición
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className={`py-3 px-4 text-center ${themeClasses.text}`}>{curso.ciclo}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  curso.tipo === 'EG' ? themeClasses.badgeEG :
                                  curso.tipo === 'ES' ? themeClasses.badgeES :
                                  themeClasses.badgeEE
                                }`}>
                                  {curso.tipo}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  curso.numero_vez === 1 ? 'bg-green-100 text-green-800' :
                                  curso.numero_vez === 2 ? 'bg-yellow-100 text-yellow-800' :
                                  curso.numero_vez === 3 ? 'bg-orange-100 text-orange-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {curso.numero_vez === 1 ? '1era' : curso.numero_vez === 2 ? '2da' : curso.numero_vez === 3 ? '3ra' : '4ta'}
                                </span>
                              </td>
                              <td className={`py-3 px-4 text-center font-semibold ${
                                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                              }`}>
                                {curso.creditos}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex gap-1 justify-center">
                                  <span className={`px-2 py-1 rounded text-xs ${themeClasses.hoursBadge}`}>
                                    T:{curso.hrs_teoria}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    isDarkMode 
                                      ? 'bg-green-500/10 text-green-300 border border-green-500/20' 
                                      : 'bg-green-50 text-green-700 border border-green-200'
                                  }`}>
                                    P:{curso.hrs_practica}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    isDarkMode 
                                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' 
                                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                                  }`}>
                                    L:{curso.hrs_lab}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Resumen y Botón */}
                  <div className={`mt-6 flex items-center justify-between border-t ${themeClasses.border} pt-6`}>
                    <div className={`flex gap-6 p-4 rounded-lg ${themeClasses.summaryBg}`}>
                      <div className="text-center">
                        <p className={`text-sm mb-1 ${themeClasses.textSecondary}`}>Total Cursos</p>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          {prematricula.totalCursos}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className={`text-sm mb-1 ${themeClasses.textSecondary}`}>Total Créditos</p>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {prematricula.totalCreditos}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => exportarPDF(prematricula)}
                      disabled={exportando === prematricula.id}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                        exportando === prematricula.id
                          ? themeClasses.buttonDisabled
                          : themeClasses.buttonPrimary
                      }`}
                    >
                      <Download className="w-5 h-5" />
                      {exportando === prematricula.id ? 'Exportando...' : 'Exportar a PDF'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}