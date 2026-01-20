"use client";
import { useState, useEffect, useMemo } from "react";
import { useApp } from '@/contexts/AppContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Top10CursosChart from '@/components/Top10CursosChart';
import DistribucionCiclosChart from '@/components/DistribucionCiclosChart';
import { Album, FileUser, BookText, BookCopy, BookMarked, RotateCcw } from 'lucide-react';

export default function Dashboard() {
  const { userData, isDarkMode } = useApp();
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState(null);
  const [filtros, setFiltros] = useState(null);
  const [filtrosActivos, setFiltrosActivos] = useState({
    semestre: '',
    anio: '',
    tipoMatricula: ''
  });
  const [busqueda, setBusqueda] = useState('');
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [vistaGrafico, setVistaGrafico] = useState('barras');

  // Clases dinámicas basadas en el tema
  const themeClasses = {
    cardBg: isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200",
    cardBgGradient: isDarkMode
      ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700"
      : "bg-gradient-to-br from-white to-gray-50 border-gray-200",
    text: isDarkMode ? "text-white" : "text-slate-800",
    textSecondary: isDarkMode ? "text-gray-400" : "text-slate-600",
    textAccent: isDarkMode ? "text-cyan-400" : "text-blue-600",
    inputBg: isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-slate-800",
    buttonPrimary: isDarkMode
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white",
    buttonSecondary: isDarkMode
      ? "bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
      : "bg-white hover:bg-gray-50 text-slate-700 border-gray-300",
    tableBorder: isDarkMode ? "border-slate-700" : "border-gray-200",
    tableHeaderBg: isDarkMode ? "bg-slate-700" : "bg-gray-50",
    tableRowHover: isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-50",
    badgeBlue: isDarkMode ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-100 text-blue-700 border-blue-200",
    badgeGreen: isDarkMode ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-green-100 text-green-700 border-green-200",
    badgeYellow: isDarkMode ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : "bg-yellow-100 text-yellow-700 border-yellow-200",
    badgePurple: isDarkMode ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-purple-100 text-purple-700 border-purple-200",
    badgeRed: isDarkMode ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-red-100 text-red-700 border-red-200",
  };

  // Cargar filtros disponibles
  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const response = await fetch('/api/dashboard/filtros');
        const data = await response.json();
        if (data.success) {
          setFiltros(data.data);
          if (data.data.periodos.length > 0) {
            const ultimo = data.data.periodos[0];
            setFiltrosActivos({
              semestre: ultimo.semestre,
              anio: ultimo.anio.toString(),
              tipoMatricula: ''
            });
          }
        }
      } catch (error) {
        console.error('Error al cargar filtros:', error);
      }
    };
    cargarFiltros();
  }, []);

  // Cargar estadísticas
  useEffect(() => {
    if (filtrosActivos.semestre && filtrosActivos.anio) {
      cargarEstadisticas();
    }
  }, [filtrosActivos]);

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtrosActivos.semestre) params.append('semestre', filtrosActivos.semestre);
      if (filtrosActivos.anio) params.append('anio', filtrosActivos.anio);
      if (filtrosActivos.tipoMatricula) params.append('tipoMatricula', filtrosActivos.tipoMatricula);

      const response = await fetch(`/api/dashboard/estadisticas?${params}`);
      const data = await response.json();

      if (data.success) {
        setEstadisticas(data.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para saber si un curso es repetición en el semestre actual
  const esCursoRepeticion = (cicloCurso) => {
    if (!filtrosActivos.semestre) return false;
    
    // Semestre I: cursos normales son impares (1,3,5...). Repetición son pares.
    // Semestre II: cursos normales son pares (2,4,6...). Repetición son impares.
    
    const esCicloPar = cicloCurso % 2 === 0;
    const esSemestrePar = filtrosActivos.semestre === 'II';

    if (esSemestrePar) {
      // Si estamos en semestre II (Par), los cursos impares son repetición
      return !esCicloPar; 
    } else {
      // Si estamos en semestre I (Impar), los cursos pares son repetición
      return esCicloPar;
    }
  };

  // Calcular estadísticas de repetición (Total de estudiantes cursando materias de repetición)
  const statsRepeticion = useMemo(() => {
    if (!estadisticas?.cursos) return { totalAlumnos: 0, totalCursos: 0 };

    const cursosRepetidos = estadisticas.cursos.filter(c => esCursoRepeticion(c.ciclo));
    
    const totalAlumnos = cursosRepetidos.reduce((acc, curr) => acc + curr.total_prematriculados, 0);
    const totalCursos = cursosRepetidos.length;

    return { totalAlumnos, totalCursos };
  }, [estadisticas, filtrosActivos]);

  const cursosFiltrados = estadisticas?.cursos?.filter(curso =>
    curso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    curso.codigo.toString().includes(busqueda)
  ) || [];

  // Exportar a Excel
  const exportarExcel = () => {
    if (!estadisticas) return;
    const wb = XLSX.utils.book_new();
    const resumenData = [
      ['REPORTE DE CARGA ACADÉMICA'],
      ['Semestre', `${filtrosActivos.anio}-${filtrosActivos.semestre}`],
      [''],
      ['RESUMEN GENERAL'],
      ['Total de estudiantes', estadisticas.resumen.total_estudiantes],
      ['Total cursos por repetición', statsRepeticion.totalAlumnos], // Actualizado
      ['Total de cursos', estadisticas.resumen.total_cursos],
    ];
    const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

    const cursosData = [
      ['Código', 'Nombre del Curso', 'Ciclo', 'Condición', 'Tipo', 'Créditos', 'N° Pre-matriculados']
    ];
    estadisticas.cursos.forEach(curso => {
      cursosData.push([
        curso.codigo,
        curso.nombre,
        curso.ciclo,
        esCursoRepeticion(curso.ciclo) ? 'Repetición' : 'Regular', // Columna extra
        curso.tipo,
        curso.creditos,
        curso.total_prematriculados
      ]);
    });
    const wsCursos = XLSX.utils.aoa_to_sheet(cursosData);
    XLSX.utils.book_append_sheet(wb, wsCursos, 'Cursos');

    estadisticas.top_10_cursos.forEach((curso, index) => {
       if (index < 10) {
        const detalleData = [
          [`${curso.codigo} - ${curso.nombre}`],
          ['Total pre-matriculados', curso.total_prematriculados],
          [''],
          ['Código', 'Apellidos y Nombres', 'Correo', 'Tipo Matrícula', 'Fecha']
        ];
        curso.estudiantes.forEach(est => {
          detalleData.push([
            est.codigo,
            `${est.apellido_paterno} ${est.apellido_materno}, ${est.nombres}`,
            est.correo,
            est.tipo_matricula,
            new Date(est.fecha_prematricula).toLocaleDateString('es-PE')
          ]);
        });
        const wsDetalle = XLSX.utils.aoa_to_sheet(detalleData);
        const nombreHoja = `${curso.codigo}`.substring(0, 31);
        XLSX.utils.book_append_sheet(wb, wsDetalle, nombreHoja);
      }
    });

    XLSX.writeFile(wb, `Carga_Academica_${filtrosActivos.anio}_${filtrosActivos.semestre}.xlsx`);
  };

  // Exportar PDF
  const exportarPDF = () => {
     if (!estadisticas) return;
     const doc = new jsPDF('l', 'mm', 'a4');
     doc.setFontSize(18);
     doc.setFont(undefined, 'bold');
     doc.text('REPORTE DE CARGA ACADÉMICA', 148, 15, { align: 'center' });
     doc.setFontSize(12);
     doc.setFont(undefined, 'normal');
     doc.text(`Semestre: ${filtrosActivos.anio}-${filtrosActivos.semestre}`, 148, 22, { align: 'center' });
     
     doc.autoTable({
      startY: 50,
      head: [['Código', 'Nombre', 'Ciclo', 'Condición', 'Pre-matriculados']],
      body: estadisticas.cursos.map(curso => [
        curso.codigo,
        curso.nombre,
        curso.ciclo,
        esCursoRepeticion(curso.ciclo) ? 'Repetición' : 'Regular',
        curso.total_prematriculados
      ]),

    });
    doc.save(`Carga_Academica.pdf`);
  };

  const verDetalleCurso = (curso) => {
    setCursoSeleccionado(curso);
    setMostrarModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 'border-cyan-400' : 'border-blue-600'}`}></div>
          <p className={`mt-4 text-lg ${themeClasses.text}`}>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className={`text-center p-8 ${themeClasses.cardBg} rounded-xl border`}>
        <p className={themeClasses.text}>No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-all duration-300">
      {/* Header con título y controles */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
            Dashboard de Prematrículas
          </h1>
          <p className={`text-2xl font-bold text-blue-600`}>
            Período: {filtrosActivos.anio}-{filtrosActivos.semestre}
          </p>
        </div>

        {/* Botones de exportación */}
        <div className="flex gap-3">
          <button
            onClick={exportarExcel}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${isDarkMode
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
              } shadow-lg hover:shadow-xl hover:scale-105`}
          >
            {/* SVG Excel */}
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" /></svg>
            Exportar Excel
          </button>

          <button
            onClick={exportarPDF}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${isDarkMode
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
              } shadow-lg hover:shadow-xl hover:scale-105`}
          >
             {/* SVG PDF */}
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className={`p-6 rounded-xl border ${themeClasses.cardBg} shadow-lg`}>
        <h2 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
              Período Académico
            </label>
            <select
              value={`${filtrosActivos.anio}-${filtrosActivos.semestre}`}
              onChange={(e) => {
                const [anio, semestre] = e.target.value.split('-');
                setFiltrosActivos(prev => ({ ...prev, anio, semestre }));
              }}
              className={`w-full px-4 py-2.5 rounded-lg border ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            >
              {filtros?.periodos.map(p => (
                <option key={p.label} value={p.label}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
              Tipo de Matrícula
            </label>
            <select
              value={filtrosActivos.tipoMatricula}
              onChange={(e) => setFiltrosActivos(prev => ({ ...prev, tipoMatricula: e.target.value }))}
              className={`w-full px-4 py-2.5 rounded-lg border ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            >
              <option value="">Todos los tipos</option>
              {filtros?.tipos_matricula.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
              Buscar Curso
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className={`w-full px-4 py-2.5 pl-10 rounded-lg border ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              <svg className={`w-5 h-5 absolute left-3 top-3 ${themeClasses.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Estudiantes */}
        <div className={`p-6 rounded-xl border ${themeClasses.cardBgGradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>Total Estudiantes</p>
              <p className={`text-3xl font-bold mt-2 ${themeClasses.text}`}>
                {estadisticas.resumen.total_estudiantes}
              </p>
            </div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <svg className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Total Cursos */}
        <div className={`p-6 rounded-xl border ${themeClasses.cardBgGradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>Total Cursos</p>
              <p className={`text-3xl font-bold mt-2 ${themeClasses.text}`}>
                {estadisticas.resumen.total_cursos}
              </p>
            </div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
              <Album className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        {/* Card 3: Total Cursos por Repetición */}
        <div className={`p-6 rounded-xl border ${themeClasses.cardBgGradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
          <div className="flex items-center justify-between">
            <div>
              
              <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>Total Cursos por Repetición</p>
              <p className={`text-3xl font-bold mt-2 ${themeClasses.text}`}>
                
                {statsRepeticion.totalAlumnos}
              </p>
              <p className={`text-xs mt-1 ${themeClasses.textSecondary}`}>
                (En {statsRepeticion.totalCursos} cursos fuera de ciclo)
              </p>
            </div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
              
              <RotateCcw className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Top10CursosChart
          data={estadisticas.top_10_cursos}
          isDarkMode={isDarkMode}
        />
        <DistribucionCiclosChart
          data={estadisticas.por_ciclo}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Distribución por Tipo de Curso */}
      <div className={`p-6 rounded-xl border ${themeClasses.cardBg} shadow-lg`}>

         <h2 className={`text-xl font-semibold mb-6 ${themeClasses.text}`}>
          Distribución por Tipo de Curso
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {estadisticas.por_tipo.map((tipo) => {
            const colorClasses = {
              'EG': {
                bg: isDarkMode ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-200',
                text: isDarkMode ? 'text-blue-400' : 'text-blue-600',
                icon: isDarkMode ? 'bg-blue-500/30' : 'bg-blue-100'
              },
              'EE': {
                bg: isDarkMode ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-50 border-purple-200',
                text: isDarkMode ? 'text-purple-400' : 'text-purple-600',
                icon: isDarkMode ? 'bg-purple-500/30' : 'bg-purple-100'
              },
              'ES': {
                bg: isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200',
                text: isDarkMode ? 'text-green-400' : 'text-green-600',
                icon: isDarkMode ? 'bg-green-500/30' : 'bg-green-100'
              }
            };
            const colors = colorClasses[tipo.tipo] || colorClasses['EG'];

            return (
              <div key={tipo.tipo} className={`p-6 rounded-xl border ${colors.bg} transition-all hover:shadow-lg`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${colors.icon} flex items-center justify-center`}>
                    {tipo.tipo === 'EG' ? (
                      <BookText className={`w-6 h-6 ${colors.text}`} />
                    ) : tipo.tipo === 'EE' ? (
                      <BookCopy className={`w-6 h-6 ${colors.text}`} />
                    ) : (
                      <BookMarked className={`w-6 h-6 ${colors.text}`} />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${themeClasses.textSecondary}`}>
                      {tipo.tipo === 'EG' ? 'Estudios Generales' :
                        tipo.tipo === 'EE' ? 'Estudios Específicos' :
                          'Estudios de Especialidad'}
                    </p>
                    <p className={`text-2xl font-bold ${colors.text}`}>
                      {tipo.tipo}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${themeClasses.textSecondary}`}>Cursos ofertados:</span>
                    <span className={`text-sm font-bold ${themeClasses.text}`}>{tipo.total_cursos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${themeClasses.textSecondary}`}>Total estudiantes:</span>
                    <span className={`text-sm font-bold ${colors.text}`}>{tipo.total_prematriculados}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla de cursos */}
      <div className={`rounded-xl border ${themeClasses.cardBg} shadow-lg overflow-hidden`}>
        <div className="p-6 border-b border-opacity-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-xl font-semibold ${themeClasses.text}`}>
                Listado Completo de Cursos
              </h2>
              <p className={`text-sm mt-1 ${themeClasses.textSecondary}`}>
                {cursosFiltrados.length} curso{cursosFiltrados.length !== 1 ? 's' : ''} encontrado{cursosFiltrados.length !== 1 ? 's' : ''}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${themeClasses.badgePurple} border`}>
              {cursosFiltrados.length} / {estadisticas.cursos.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={themeClasses.tableHeaderBg}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${themeClasses.text}`}>
                  Código
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${themeClasses.text}`}>
                  Nombre del Curso
                </th>
                <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${themeClasses.text}`}>
                  Ciclo
                </th>
                <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${themeClasses.text}`}>
                  Tipo
                </th>
                <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${themeClasses.text}`}>
                  Créditos
                </th>
                <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${themeClasses.text}`}>
                  N° Pre-matriculados
                </th>
                <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${themeClasses.text}`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-opacity-10">
              {cursosFiltrados.map((curso, index) => {
                const esRepeticion = esCursoRepeticion(curso.ciclo);
                return (
                  <tr
                    key={curso.codigo}
                    className={`${themeClasses.tableRowHover} transition-colors`}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap ${themeClasses.text} font-medium`}>
                      {curso.codigo}
                    </td>
                    <td className={`px-6 py-4 ${themeClasses.text}`}>
                      <div className="flex flex-col">
                        <div className="font-medium flex items-center gap-2">
                          {curso.nombre}
                          
                          {/* INDICADOR DE REPETICIÓN */}
                          {esRepeticion && (
                             <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1 font-bold">
                               <RotateCcw className="w-3 h-3" />
                               Repetición
                             </span>
                          )}
                        </div>
                        <div className={`text-xs ${themeClasses.textSecondary}`}>
                          {curso.departamento}
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center ${themeClasses.text}`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${themeClasses.badgeBlue} border`}>
                        {curso.ciclo}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center ${themeClasses.text}`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${curso.tipo === 'EG' ? themeClasses.badgeBlue :
                        curso.tipo === 'EE' ? themeClasses.badgePurple :
                          themeClasses.badgeGreen
                        }`}>
                        {curso.tipo}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center ${themeClasses.text} font-medium`}>
                      {curso.creditos}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center`}>
                      <span className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-lg font-bold ${curso.total_prematriculados > 30
                        ? isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                        : curso.total_prematriculados > 15
                          ? isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                          : isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                        }`}>
                        {curso.total_prematriculados}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => verDetalleCurso(curso)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${themeClasses.buttonPrimary} hover:scale-105 shadow-md hover:shadow-lg`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {cursosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <svg className={`mx-auto h-12 w-12 ${themeClasses.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className={`mt-2 text-sm font-medium ${themeClasses.text}`}>No se encontraron cursos</h3>
            <p className={`mt-1 text-sm ${themeClasses.textSecondary}`}>
              Intenta con otros filtros o búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalle del curso */}
      {mostrarModal && cursoSeleccionado && (
          <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setMostrarModal(false)}>
          <div
            className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border ${themeClasses.cardBg} shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >

            <div className={`sticky top-0 z-10 px-6 py-4 border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} flex justify-between items-start`}>
              <div className="flex-1">
                <h3 className={`text-2xl font-bold ${themeClasses.text}`}>
                  {cursoSeleccionado.nombre}
                </h3>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${themeClasses.badgeBlue} border`}>
                    Código: {cursoSeleccionado.codigo}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${themeClasses.badgeGreen} border`}>
                    Ciclo: {cursoSeleccionado.ciclo}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${themeClasses.badgePurple} border`}>
                    {cursoSeleccionado.tipo}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${themeClasses.badgeYellow} border`}>
                    {cursoSeleccionado.creditos} Créditos
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMostrarModal(false)}
                className={`ml-4 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
              >
                <svg className={`w-6 h-6 ${themeClasses.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Resumen */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col gap-4">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'} flex-1 flex flex-col justify-center`}>
                    <p className={`text-sm ${themeClasses.textSecondary} text-center`}>Total Pre-matriculados</p>
                    <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-center`}>
                      {cursoSeleccionado.total_prematriculados}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'} flex-1 flex flex-col justify-center`}>
                    <p className={`text-sm ${themeClasses.textSecondary} text-center`}>Departamento</p>
                    <p className={`text-lg font-semibold mt-1 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-center`}>
                      {cursoSeleccionado.departamento}
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-500/10 border-gray-500/30' : 'bg-gray-50 border-gray-200'} md:col-span-2 flex flex-col justify-center`}>
                  <p className={`text-sm ${themeClasses.textSecondary} text-center mb-4`}>Estudiantes matriculados por número de vez en el curso</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                      <p className={`text-xs ${themeClasses.textSecondary} text-center`}>1era vez</p>
                      <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'} text-center`}>
                        {cursoSeleccionado.primera_vez || 0}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                      <p className={`text-xs ${themeClasses.textSecondary} text-center`}>2da vez</p>
                      <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} text-center`}>
                        {cursoSeleccionado.segunda_vez || 0}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
                      <p className={`text-xs ${themeClasses.textSecondary} text-center`}>3era vez</p>
                      <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} text-center`}>
                        {cursoSeleccionado.tercera_vez || 0}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                      <p className={`text-xs ${themeClasses.textSecondary} text-center`}>4ta vez</p>
                      <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-600'} text-center`}>
                        {cursoSeleccionado.cuarta_vez || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>
                  Estudiantes Pre-matriculados: {cursoSeleccionado.estudiantes.length}
                </h4>
                <div className={`rounded-lg border ${themeClasses.tableBorder} overflow-hidden`}>
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full">
                      <thead className={`sticky top-0 ${themeClasses.tableHeaderBg}`}>
                        <tr>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${themeClasses.text}`}>#</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${themeClasses.text}`}>Código</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${themeClasses.text}`}>Apellidos y Nombres</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${themeClasses.text}`}>Correo</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${themeClasses.text}`}>Tipo Matrícula</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${themeClasses.text}`}>N° Vez</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${themeClasses.text}`}>Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-opacity-10">
                        {cursoSeleccionado.estudiantes.map((estudiante, index) => {
                          const getNumeroVezColor = (numeroVez) => {
                            if (numeroVez === 1) return themeClasses.badgeGreen;
                            if (numeroVez === 2) return themeClasses.badgeYellow;
                            if (numeroVez === 3) return themeClasses.badgePurple;
                            return themeClasses.badgeRed || themeClasses.badgePurple;
                          };

                          return (
                            <tr key={index} className={themeClasses.tableRowHover}>
                              <td className={`px-4 py-3 ${themeClasses.textSecondary} text-sm`}>
                                {index + 1}
                              </td>
                              <td className={`px-4 py-3 ${themeClasses.text} font-medium text-sm`}>
                                {estudiante.codigo}
                              </td>
                              <td className={`px-4 py-3 ${themeClasses.text} text-sm`}>
                                {estudiante.apellido_paterno} {estudiante.apellido_materno}, {estudiante.nombres}
                              </td>
                              <td className={`px-4 py-3 ${themeClasses.textSecondary} text-sm`}>
                                {estudiante.correo}
                              </td>
                              <td className={`px-4 py-3 text-sm`}>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${themeClasses.badgeBlue} border`}>
                                  {estudiante.tipo_matricula}
                                </span>
                              </td>
                              <td className={`px-4 py-3 text-sm`}>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getNumeroVezColor(estudiante.numero_vez)} border`}>
                                  {estudiante.numero_vez}° vez
                                </span>
                              </td>
                              <td className={`px-4 py-3 ${themeClasses.textSecondary} text-sm`}>
                                {new Date(estudiante.fecha_prematricula).toLocaleDateString('es-PE')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    const wb = XLSX.utils.book_new();
                    const data = [
                      ['ESTUDIANTES PRE-MATRICULADOS'],
                      [`Curso: ${cursoSeleccionado.nombre}`],
                      [`Código: ${cursoSeleccionado.codigo}`],
                      [''],
                      ['N°', 'Código', 'Apellidos y Nombres', 'Correo', 'Tipo Matrícula', 'N° Vez', 'Fecha']
                    ];
                    cursoSeleccionado.estudiantes.forEach((est, i) => {
                      data.push([
                        i + 1,
                        est.codigo,
                        `${est.apellido_paterno} ${est.apellido_materno}, ${est.nombres}`,
                        est.correo,
                        est.tipo_matricula,
                        est.numero_vez,
                        new Date(est.fecha_prematricula).toLocaleDateString('es-PE')
                      ]);
                    });
                    const ws = XLSX.utils.aoa_to_sheet(data);
                    XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
                    XLSX.writeFile(wb, `Estudiantes_${cursoSeleccionado.codigo}_${cursoSeleccionado.nombre.substring(0, 20)}.xlsx`);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white shadow-md hover:shadow-lg`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" />
                  </svg>
                  Exportar Lista
                </button>
                <button
                  onClick={() => setMostrarModal(false)}
                  className={`px-4 py-2 rounded-lg font-medium border transition-all ${themeClasses.buttonSecondary}`}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}