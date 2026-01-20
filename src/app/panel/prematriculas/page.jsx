"use client";

import React, { useState, useLayoutEffect, useRef, useMemo, useEffect } from 'react';
import { Hash, BookOpen, Zap, Star, BadgeCent, ChevronDown, Calendar, GraduationCap, X, Check, Trash2, AlertTriangle, CircleArrowRight, BookCheck, RotateCcw, MousePointer2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const codeToColMap = {
  13024: 1, 13029: 2, 13027: 3, 13021: 4, 13023: 5, 13028: 6, 13031: 7,
  13040: 1, 13043: 2, 13036: 3, 13039: 4, 13038: 5, 13034: 6, 13046: 7,
  13629: 1, 13630: 3, 13631: 4, 13632: 5, 13633: 6, 13634: 7,
  13635: 1, 13636: 2, 13637: 4, 13638: 5, 13639: 6, 13640: 7,
  13641: 2, 13642: 3, 13643: 4, 13644: 5, 13645: 6, 13646: 7,
  14068: 1, 14069: 2, 14070: 3, 14071: 4, 14072: 5, 14073: 6,
  14074: 2, 14075: 3, 14076: 4, 14077: 5, 14078: 6, 14079: 7,
  14080: 4, 14081: 5, 14082: 6, 14083: 7,
  14084: 1, 14085: 2, 13400: 3, 14087: 4, 14088: 5, 14089: 7,
  14090: 1, 14091: 3, 14092: 4, 14093: 5, 14094: 6, 14300: 7
};

const typeToColor = {
  EG: 'emerald',
  EE: 'orange',
  ES: 'sky'
};

const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const colorMap = {
  emerald: {
    bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    hover: "hover:from-emerald-400 hover:to-emerald-500",
    border: "border-emerald-400",
    shadow: "shadow-emerald-500/25",
    glow: "shadow-emerald-400/50"
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-500 to-orange-600",
    hover: "hover:from-orange-400 hover:to-orange-500",
    border: "border-orange-400",
    shadow: "shadow-orange-500/25",
    glow: "shadow-orange-400/50"
  },
  sky: {
    bg: "bg-gradient-to-br from-sky-500 to-sky-600",
    hover: "hover:from-sky-400 hover:to-sky-500",
    border: "border-sky-400",
    shadow: "shadow-sky-500/25",
    glow: "shadow-sky-400/50"
  },
};

const typeIcons = {
  EG: BookOpen,
  EE: Zap,
  ES: Star
};

const matriculaTypes = {
  Regular: { credits: 22, color: 'bg-blue-500' },
  Especial: { credits: 12, color: 'bg-yellow-500' },
  Excepcional: { credits: 26, color: 'bg-purple-500' }
};

const Dropdown = ({ value, onChange, options, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 border bg-white text-black border-gray-300 rounded-lg shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-gray-600 hover:text-gray-900"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente Click Derecho
const CourseNode = React.forwardRef(({ course, onClick, onRightClick, isSelected, isEnrolled, isPrerequisite, isSuccessor, isSelectable }, ref) => {
  const colorTheme = colorMap[course.color] || colorMap.emerald;
  const TypeIcon = typeIcons[course.tipo] || BookOpen;

  let stateClasses = "opacity-100 border-2 border-white/20";
  let shadowClasses = `shadow-lg ${colorTheme.shadow}`;
  let cursorClass = "cursor-pointer";
  let bgClasses = colorTheme.bg;

  if (!isSelectable && !isEnrolled) {
    cursorClass = "cursor-not-allowed opacity-60 grayscale-[0.5]";
  }

  if (isEnrolled) {
    cursorClass = "cursor-pointer opacity-100 grayscale-0";
    bgClasses = "bg-gradient-to-br from-yellow-400 to-yellow-500";
    stateClasses = "ring-4 ring-yellow-400/80 ring-offset-4 ring-offset-gray-900 border-2 border-yellow-400";
    shadowClasses = "shadow-2xl shadow-yellow-400/50";
  } else if (isSelected) {
    stateClasses = "ring-4 ring-yellow-400/80 ring-offset-4 ring-offset-gray-900 scale-110 border-2 border-yellow-400";
    shadowClasses = "shadow-2xl shadow-yellow-400/50";
  } else if (isPrerequisite) {
    stateClasses = "ring-3 ring-red-700/80 scale-105 border-2 border-red-400";
    shadowClasses = "shadow-xl shadow-red-700/40";
  } else if (isSuccessor) {
    stateClasses = "ring-3 ring-green-400/80 scale-105 border-2 border-green-400";
    shadowClasses = "shadow-xl shadow-green-400/40";
  }

  // Manejador de click derecho
  const handleContextMenu = (e) => {
    if (!isSelectable && !isEnrolled) {
      onRightClick(e, course);
    }
  };

  return (
    <div
      ref={ref}
      id={course.codigo.toString()}
      className="absolute"
      style={{
        gridRowStart: course.ciclo,
        gridColumnStart: codeToColMap[course.codigo] + 1,
      }}
    >
      <div
        onClick={() => isSelectable && !isEnrolled && onClick(course)}
        onContextMenu={handleContextMenu}
        className={`w-35 h-32 p-3 rounded-2xl backdrop-blur-sm ${cursorClass}
          transition-all duration-500 ease-out transform ${isSelectable && !isEnrolled ? 'hover:scale-105' : ''}
          ${bgClasses} ${isSelectable && !isEnrolled ? colorTheme.hover : ''} ${stateClasses} ${shadowClasses}
          border relative overflow-hidden group`}
      >
        {isSelectable && !isEnrolled && (
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        )}

        {!isSelectable && !isEnrolled && (
           <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 rounded-2xl pointer-events-none">
             <div className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
               <RotateCcw className="w-3 h-3" />
               Solo por Repetición
             </div>
           </div>
        )}

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex-1 flex items-start">
            <h3 className="text-white text-sm leading-tight line-clamp-2 pr-1">
              {course.nombre}
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-white/90 text-xs font-medium">{course.codigo}</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                <TypeIcon className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-semibold">{course.tipo}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1 bg-amber-900/60 px-2 py-1 rounded-md">
                <BadgeCent className="w-3 h-3 text-yellow-300" />
                <span className="text-white font-medium">{course.creditos}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="bg-[#1D293D]/50 px-1.5 py-0.5 rounded text-white font-medium border border-blue-400/30">
                  {course.hrs_teoria}
                </div>
                <div className="bg-[#364153]/50 px-1.5 py-0.5 rounded text-white font-medium border border-green-400/30">
                  {course.hrs_practica}
                </div>
                <div className="bg-[#3F3F46]/50 px-1.5 py-0.5 rounded text-white font-medium border border-purple-400/30">
                  {course.hrs_lab}
                </div>
              </div>
            </div>
          </div>
        </div>

        {(isPrerequisite || isSuccessor) && (
          <div className="absolute top-2 right-2">
            <div className={`w-3 h-3 rounded-full ${isPrerequisite ? 'bg-red-700' : 'bg-green-400'} animate-pulse shadow-lg`}></div>
          </div>
        )}
      </div>
    </div>
  );
});
CourseNode.displayName = "CourseNode";

// Componente Principal
export default function PrematriculasPage() {
  const [view, setView] = useState('form');
  const [promedioPonderado, setPromedioPonderado] = useState('');
  const [tipoMatricula, setTipoMatricula] = useState('');
  const [periodo, setPeriodo] = useState('');

  const [coursesData, setCoursesData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showConfirmBanner, setShowConfirmBanner] = useState(false);
  const [showNumeroVezSelector, setShowNumeroVezSelector] = useState(false);
  const [numeroVezTemp, setNumeroVezTemp] = useState(1);
  const [showCreditError, setShowCreditError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [periodosOptions, setPeriodosOptions] = useState([]);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    course: null
  });

  const courseRefs = useRef({});
  const gridRef = useRef(null);
  const summaryRef = useRef(null);

  const { userData, isDarkMode } = useApp();

  const availableMatriculaTypes = useMemo(() => {
    const promedio = parseFloat(promedioPonderado);
    if (isNaN(promedio)) return [];
    return promedio >= 16 ? ['Regular', 'Especial', 'Excepcional'] : ['Regular', 'Especial'];
  }, [promedioPonderado]);

  const selectableCycles = useMemo(() => {
    if (!periodo) return [];
    return periodo.endsWith('-I') ? [1, 3, 5, 7, 9] : [2, 4, 6, 8, 10];
  }, [periodo]);

  const totalCredits = useMemo(() => {
    return enrolledCourses.reduce((sum, course) => sum + course.creditos, 0);
  }, [enrolledCourses]);

  const calculatedTipoMatricula = useMemo(() => {
    const numeroVeces = enrolledCourses.map(c => c.numero_vez);
    if (numeroVeces.includes(4)) return 'Especial';
    if (numeroVeces.includes(3)) return 'Especial';
    return tipoMatricula;
  }, [enrolledCourses, tipoMatricula]);

  const maxCredits = useMemo(() => {
    return matriculaTypes[calculatedTipoMatricula]?.credits || 0;
  }, [calculatedTipoMatricula]);

  // Cierra el menú si se hace click en otro lado
  useEffect(() => {
    const handleClickOutside = () => setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  useEffect(() => {
    const cargarPeriodosAcademicos = async () => {
      try {
        const response = await fetch('/api/periodos-academicos');
        const data = await response.json();
        if (data.success) {
          setPeriodosOptions(data.data);
        } else {
          setPeriodosOptions(['Sin Periodos']);
        }
      } catch (error) {
        setPeriodosOptions(['Sin Periodos']);
      }
    };
    cargarPeriodosAcademicos();
  }, []);

  useEffect(() => {
    if (view === 'malla' && coursesData.length === 0) {
      fetchCoursesData();
    }
  }, [view]);

  const fetchCoursesData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      const formattedData = data.map(course => ({
        ...course,
        color: typeToColor[course.tipo] || 'gray',
      }));
      setCoursesData(formattedData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (promedioPonderado && tipoMatricula && periodo) {
      setView('malla');
    }
  };

  const handleCourseClick = (course) => {
    if (!selectableCycles.includes(course.ciclo)) return;
    if (enrolledCourses.some(c => c.codigo === course.codigo)) return;

    setSelectedCourse(course);
    setShowConfirmBanner(true);
    setShowNumeroVezSelector(false);
    setNumeroVezTemp(1);
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Manejo del Click Derecho (Anticlick)
  const handleCourseRightClick = (e, course) => {
    e.preventDefault(); 
    if (!enrolledCourses.some(c => c.codigo === course.codigo)) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        course: course
      });
    }
  };

  // Acción al seleccionar "Curso de Repetición"
  const handleRepetitionSelect = () => {
    if (contextMenu.course) {
      setSelectedCourse(contextMenu.course);
      setShowConfirmBanner(true);
      setShowNumeroVezSelector(true);
      setNumeroVezTemp(1);
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleElegirCurso = () => {
    setShowNumeroVezSelector(true);
  };

  const validateCourseSelection = (course, numeroVez) => {
    if (numeroVez === 4 && enrolledCourses.length > 0) {
      return {
        valid: false,
        message: 'Si llevas un curso por cuarta vez, solo puedes llevar ese curso.'
      };
    }

    if (enrolledCourses.some(c => c.numero_vez === 4)) {
      return {
        valid: false,
        message: 'Ya tienes un curso por cuarta vez. No puedes agregar más.'
      };
    }
    
    if (course.prereqCodes && course.prereqCodes.length > 0) {
      const prerequisitosMismoCiclo = course.prereqCodes.filter(prereqCode => {
        const prereqCourse = coursesData.find(c => c.codigo === prereqCode);
        if (prereqCourse) {
          return selectableCycles.includes(prereqCourse.ciclo);
        }
        return false;
      });

      for (const prereqCode of prerequisitosMismoCiclo) {
        const prereqEnrollado = enrolledCourses.find(c => c.codigo === prereqCode);
        if (prereqEnrollado) {
           const prereqCourse = coursesData.find(c => c.codigo === prereqCode);
           return {
             valid: false,
             message: `Conflicto de prerequisito con "${prereqCourse?.nombre}" en el mismo período.`
           };
        }
      }
    }

    return { valid: true };
  };

  const handleConfirmarNumeroVez = () => {
    if (!selectedCourse) return;

    const validation = validateCourseSelection(selectedCourse, numeroVezTemp);
    
    if (!validation.valid) {
      setErrorMessage(validation.message);
      setShowCreditError(true);
      setShowConfirmBanner(false);
      setShowNumeroVezSelector(false);
      setSelectedCourse(null);
      setTimeout(() => setShowCreditError(false), 7000);
      return;
    }

    const courseWithNumeroVez = {
      ...selectedCourse,
      numero_vez: numeroVezTemp
    };

    const newTotalCredits = totalCredits + selectedCourse.creditos;
    const newCalculatedTipo = [...enrolledCourses, courseWithNumeroVez];
    const numeroVeces = newCalculatedTipo.map(c => c.numero_vez);
    
    let tipoParaValidar = tipoMatricula;
    if (numeroVeces.includes(4) || numeroVeces.includes(3)) {
      tipoParaValidar = 'Especial';
    }

    const limiteCreditos = matriculaTypes[tipoParaValidar].credits;

    if (newTotalCredits > limiteCreditos) {
      setErrorMessage(`Excede límite de créditos (${limiteCreditos}). Total: ${newTotalCredits}.`);
      setShowCreditError(true);
      setShowConfirmBanner(false);
      setShowNumeroVezSelector(false);
      setSelectedCourse(null);
      setTimeout(() => setShowCreditError(false), 5000);
      return;
    }

    setEnrolledCourses([...enrolledCourses, courseWithNumeroVez]);
    setShowConfirmBanner(false);
    setShowNumeroVezSelector(false);
    setSelectedCourse(null);
    setNumeroVezTemp(1);
  };

  const handleCancelCourse = () => {
    setShowConfirmBanner(false);
    setShowNumeroVezSelector(false);
    setSelectedCourse(null);
    setNumeroVezTemp(1);
  };

  const handleRemoveCourse = (courseCode) => {
    setEnrolledCourses(enrolledCourses.filter(c => c.codigo !== courseCode));
  };

  const scrollToSummary = () => {
    summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrematricula = () => {
    if (enrolledCourses.length === 0) return;
    setShowFinalConfirm(true);
  };

  const handleConfirmPrematricula = async () => {
    setIsSubmitting(true);
    try {
      const [anio, semestreStr] = periodo.split('-');
      const semestre = semestreStr === 'I' ? 'I' : 'II';

      const response = await fetch('/api/prematricula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          semestre,
          anio: parseInt(anio),
          tipoMatricula: calculatedTipoMatricula,
          cursos: enrolledCourses.map(c => ({
            codigo: c.codigo,
            numero_vez: c.numero_vez
          }))
        })
      });

      const result = await response.json();

      if (response.ok) {
        setShowFinalConfirm(false);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setView('form');
          setEnrolledCourses([]);
          setPromedioPonderado('');
          setTipoMatricula('');
          setPeriodo('');
        }, 3000);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Error al realizar la prematrícula');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToForm = () => {
    setView('form');
    setSelectedCourse(null);
    setEnrolledCourses([]);
  };

  useLayoutEffect(() => {
    if (coursesData.length === 0 || view !== 'malla') return;
    const calculateLines = () => {
      const newLines = [];
      const gridRect = gridRef.current?.getBoundingClientRect();
      if (!gridRect) return;

      coursesData.forEach(course => {
        if (course.prereqCodes && course.prereqCodes.length > 0) {
          course.prereqCodes.forEach(prereqCode => {
            const fromNode = courseRefs.current[prereqCode];
            const toNode = courseRefs.current[course.codigo];

            if (fromNode && toNode) {
              const fromRect = fromNode.getBoundingClientRect();
              const toRect = toNode.getBoundingClientRect();

              newLines.push({
                id: `${prereqCode}-${course.codigo}`,
                x1: fromRect.left + fromRect.width / 2 - gridRect.left,
                y1: fromRect.top + fromRect.height - gridRect.top,
                x2: toRect.left + toRect.width / 2 - gridRect.left,
                y2: toRect.top - gridRect.top,
                isPrereqHighlighted: selectedCourse &&
                  (selectedCourse.codigo === course.codigo &&
                    selectedCourse.prereqCodes?.includes(prereqCode)),
                isSuccessorHighlighted: selectedCourse &&
                  prereqCode === selectedCourse.codigo,
                isVisible: !selectedCourse ||
                  (selectedCourse.codigo === course.codigo &&
                    selectedCourse.prereqCodes?.includes(prereqCode)) ||
                  prereqCode === selectedCourse.codigo
              });
            }
          });
        }
      });
      setLines(newLines);
    };

    const timer = setTimeout(calculateLines, 100);
    window.addEventListener('resize', calculateLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateLines);
    };
  }, [selectedCourse, coursesData, view]);

  const relationships = useMemo(() => {
    if (!selectedCourse) return { prerequisites: [], successors: [] };

    const successors = coursesData.filter(c =>
      c.prereqCodes?.includes(selectedCourse.codigo)
    ).map(c => c.codigo);

    return {
      prerequisites: selectedCourse.prereqCodes || [],
      successors,
    }
  }, [selectedCourse, coursesData]);

  // Render del Menú
  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;
    return (
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden min-w-[200px] animate-in fade-in zoom-in-95 duration-100"
        style={{ top: contextMenu.y, left: contextMenu.x }}
      >
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Opciones de Curso</span>
        </div>
        <div className="flex flex-col p-1">
          <button
            onClick={handleRepetitionSelect}
            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-sm font-medium rounded-md transition-colors text-left"
          >
            <RotateCcw className="w-4 h-4" />
            Curso de Repetición
          </button>
          <div className="h-px bg-gray-100 my-1"></div>
          <button
            onClick={() => setContextMenu({ ...contextMenu, visible: false })}
            className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-gray-700 hover:text-red-700 text-sm font-medium rounded-md transition-colors text-left"
          >
            <X className="w-4 h-4" />
            Cerrar
          </button>
        </div>
      </div>
    );
  };

  // Vista Formulario
  if (view === 'form') {
    const InfoTooltip = ({ text }) => {
      return (
        <div className="group relative flex items-center ml-2">
          {/* El Ícono 'i' */}
          <div className="cursor-help text-yellow-600 hover:text-yellow-200 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>

          {/* El Tooltip (Caja de texto) */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none">
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      );
    };
    return (
      <section className={` ${isDarkMode ? 'bg-gray-900' : ''} flex items-center justify-center p-4`}>
  <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden`}>

    {/* HEADER */}
    <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} px-6 py-6 text-white text-center relative overflow-hidden`}>
      <div className="absolute inset-0 bg-black opacity-5 pattern-dots"></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-2xl font-bold">Iniciar Prematrícula</h1>
          
        </div>
        <p className="text-blue-100 text-sm font-medium">
          Completa todos los datos del formulario para continuar con tu proceso de prematrícula.
        </p>
      </div>
    </div>

    <form onSubmit={handleFormSubmit} className="px-6 py-8">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* INPUT: PERÍODO */}
        <div className="space-y-2">
          <label className={`flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
            Período
            <InfoTooltip text="Solo puedes iniciar la prematrícula si hay un período activo establecido por la Secretaría o Dirección de Escuela." />
          </label>
          <Dropdown
            value={periodo}
            onChange={setPeriodo}
            options={periodosOptions}
            placeholder={periodosOptions.length === 0 ? "Cargando..." : "Seleccione..."}
            disabled={periodosOptions.length === 0}
          />
          {periodosOptions.length === 0 && (
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No hay períodos activos
            </p>
          )}
        </div>

        {/* INPUT: PROMEDIO */}
        <div className="space-y-2">
          <label className={`flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</span>
            Promedio
            <InfoTooltip text="Con promedio menor a 16, solo puedes acceder a matrícula Regular o Especial." />
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max="20"
              value={promedioPonderado}
              onChange={(e) => setPromedioPonderado(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${isDarkMode
                  ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
                }`}
              placeholder="Ej: 16.50"
              required
            />
          </div>
        </div>

        {/* INPUT: TIPO DE MATRÍCULA */}
        <div className="space-y-2">
          <label className={`flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">3</span>
            Matrícula
          </label>
          <Dropdown
            value={tipoMatricula}
            onChange={setTipoMatricula}
            options={availableMatriculaTypes}
            placeholder="Seleccione..."
            disabled={!promedioPonderado || availableMatriculaTypes.length === 0}
          />
        </div>

      </div>

      {/* CONTENEDOR DEL BOTÓN */}
      <div className="mt-18 flex justify-center w-full">
        <button
          type="submit"
          disabled={!promedioPonderado || !tipoMatricula || !periodo}
          className={`group relative overflow-hidden rounded-xl font-semibold py-3 px-10 transition-all duration-300 transform ${!promedioPonderado || !tipoMatricula || !periodo
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.05] active:scale-[0.98]'
            }`}
        >
          <span className="relative z-10 flex items-center gap-3">
            <span className="whitespace-nowrap">Selección de Cursos</span>
            <svg className={`w-5 h-5 transition-transform duration-300 ${!promedioPonderado || !tipoMatricula || !periodo ? '' : 'group-hover:translate-x-1'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <CircleArrowRight />
            </svg>
          </span>
          {!(!promedioPonderado || !tipoMatricula || !periodo) && (
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          )}
        </button>
      </div>

    </form>
  </div>
</section>
    );
  }

  if (loading) {
    return (
      <section className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Cargando malla curricular...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`min-h-full pb-24 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      
      {renderContextMenu()}

      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 top-0 z-30 rounded-2xl shadow-lg`}>
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToForm}
            className={`flex items-center space-x-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <React.Fragment>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m12 8-4 4 4 4"/><path d="M16 12H8"/></svg>
            </React.Fragment>
            <span>Regresar</span>
          </button>

          <div className="flex items-center space-x-8">
            <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Hash className="w-5 h-5" />
              <span className="font-medium">P. Ponderado: {promedioPonderado}</span>
            </div>

            <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Calendar className="w-5 h-5" />
              <span className="font-medium">{periodo}</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${matriculaTypes[calculatedTipoMatricula]?.color}`}>
                {calculatedTipoMatricula}
              </div>
            </div>

            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${totalCredits > maxCredits
                ? 'bg-red-900/20 border-red-700'
                : isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
              }`}>
              <BadgeCent className={`w-5 h-5 ${totalCredits > maxCredits ? 'text-red-600' : 'text-yellow-600'}`} />
              <span className={`font-bold ${totalCredits > maxCredits
                  ? 'text-red-400'
                  : isDarkMode ? 'text-yellow-400' : 'text-yellow-800'
                }`}>
                {totalCredits} / {maxCredits} créditos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de Error de créditos */}
      {showCreditError && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce max-w-2xl">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold">¡Error en la selección!</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-green-500 text-white px-8 py-6 rounded-2xl shadow-2xl text-center">
            <Check className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Prematrícula exitosa!</h2>
            <p>Tu prematrícula ha sido registrada correctamente.</p>
          </div>
        </div>
      )}

      {/* Banner de confirmación */}
      {showConfirmBanner && selectedCourse && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-11/12 max-w-4xl">
          <div className={`${isDarkMode
              ? 'bg-gradient-to-r bg-white border-3 border-amber-400'
              : 'bg-gradient-to-r bg-white border-3 border-amber-400'
            } px-6 py-3 shadow-lg rounded-lg`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                  {selectedCourse.nombre}
                  {!selectableCycles.includes(selectedCourse.ciclo) && (
                     <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-200">
                       Repetición
                     </span>
                  )}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex mr-2 items-center space-x-1 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                      <span className="text-white/90 text-xs font-medium">Código: {selectedCourse.codigo}</span>
                    </div>
                    <div className="flex text-xs mr-2 items-center space-x-1 bg-amber-900/60 px-2 py-1 rounded-md">
                      <BadgeCent className="w-3 h-3 text-yellow-300" />
                      <span className="text-white font-medium">Créditos: {selectedCourse.creditos}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="bg-[#1D293D]/50 px-1.5 py-0.5 rounded text-white font-medium border border-blue-400/30">
                        Teoría: {selectedCourse.hrs_teoria} hrs.
                      </div>
                      <div className="bg-[#364153]/50 px-1.5 py-0.5 rounded text-white font-medium border border-green-400/30">
                        Práctica: {selectedCourse.hrs_practica} hrs.
                      </div>
                      <div className="bg-[#3F3F46]/50 px-1.5 py-0.5 rounded text-white font-medium border border-purple-400/30">
                        Laboratorio: {selectedCourse.hrs_lab} hrs.
                      </div>
                    </div>
                  </div>
                </div>

                {!showNumeroVezSelector && (
                  <div className="flex items-center space-x-4 text-sm mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-700 rounded-full"></div>
                      <span className="text-gray-800">Prerequisitos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-gray-800">Sucesores</span>
                    </div>
                  </div>
                )}

                {showNumeroVezSelector && (
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Selecciona el número de vez que llevarás este curso:
                    </label>
                    <div className="flex space-x-3">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() => setNumeroVezTemp(num)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            numeroVezTemp === num
                              ? 'bg-blue-600 text-white scale-110 shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
                          }`}
                        >
                          {num === 1 ? '1era vez' : num === 2 ? '2da vez' : num === 3 ? '3ra vez' : '4ta vez'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 ml-4">
                {!showNumeroVezSelector ? (
                  <>
                    <button
                      onClick={handleElegirCurso}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>Elegir curso</span>
                    </button>
                    <button
                      onClick={handleCancelCourse}
                      className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancelar</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleConfirmarNumeroVez}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>Confirmar selección</span>
                    </button>
                    <button
                      onClick={handleCancelCourse}
                      className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancelar</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante para ver resumen */}
      {enrolledCourses.length > 0 && (
        <button
          onClick={scrollToSummary}
          className="fixed bottom-6 left-6 z-30 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl transition-all flex items-center space-x-2"
        >
          <BookCheck className="w-5 h-5" />
          <span>Ver cursos ({enrolledCourses.length})</span>
        </button>
      )}

      {/* Malla curricular */}
      <div className="w-full overflow-x-auto p-10">
        <div
          ref={gridRef}
          className="relative grid gap-x-5 gap-y-12 items-start"
          style={{
            gridTemplateColumns: 'auto repeat(7, 9rem)',
            gridTemplateRows: `repeat(${romanNumerals.length}, 8rem)`,
            minWidth: '1000px',
          }}
        >
          {romanNumerals.map((numeral, index) => {
            const cycleNumber = index + 1;
            const isSelectableCycle = selectableCycles.includes(cycleNumber);

            return (
              <div
                key={`cycle-${cycleNumber}`}
                className="sticky left-0 z-20 flex items-center justify-center h-32"
                style={{ gridRowStart: cycleNumber, gridColumnStart: 1 }}
              >
                <div className={`flex flex-col items-center justify-center px-2 rounded-lg border h-32 ${isSelectableCycle
                    ? isDarkMode
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-blue-500 bg-blue-100'
                    : isDarkMode
                      ? 'border-gray-600 bg-gray-800'
                      : 'border-gray-300 bg-gray-100'
                  }`}>
                  <span className={`text-sm ${isSelectableCycle
                      ? isDarkMode ? 'text-blue-300 font-bold' : 'text-blue-700 font-bold'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    Ciclo
                  </span>
                  <span className={`font-bold text-2xl ${isSelectableCycle
                      ? isDarkMode ? 'text-blue-400 font-bold' : 'text-blue-600 font-bold'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {numeral}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Capa SVG */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className={isDarkMode ? "fill-current text-gray-500" : "fill-current text-gray-600"} />
              </marker>
              <marker id="arrowhead-highlighted" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-current text-red-700" />
              </marker>
              <marker id="arrowhead-successor" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-current text-green-500" />
              </marker>
            </defs>
            {lines.map(line => {
              let lineColor = isDarkMode ? "text-gray-500" : "text-gray-600";
              let strokeW = 1.5;
              let marker = "url(#arrowhead)";
              let opacity = selectedCourse ? 0 : 1;

              if (line.isPrereqHighlighted) {
                lineColor = "text-red-700";
                strokeW = 3;
                marker = "url(#arrowhead-highlighted)";
                opacity = 1;
              } else if (line.isSuccessorHighlighted) {
                lineColor = "text-green-500";
                strokeW = 3;
                marker = "url(#arrowhead-successor)";
                opacity = 1;
              }

              return (
                <path
                  key={line.id}
                  d={`M ${line.x1} ${line.y1} C ${line.x1} ${line.y1 + 50}, ${line.x2} ${line.y2 - 50}, ${line.x2} ${line.y2 - 10}`}
                  stroke="currentColor"
                  strokeWidth={strokeW}
                  fill="none"
                  className={`transition-all duration-300 ${lineColor}`}
                  markerEnd={marker}
                  opacity={opacity}
                />
              );
            })}
          </svg>

          {/* Nodos de los cursos */}
          {coursesData.map(course => {
            const isSelectable = selectableCycles.includes(course.ciclo);
            const isEnrolled = enrolledCourses.some(c => c.codigo === course.codigo);

            return (
              <CourseNode
                key={course.codigo}
                ref={el => courseRefs.current[course.codigo] = el}
                course={course}
                onClick={handleCourseClick}
                onRightClick={handleCourseRightClick}
                isSelected={selectedCourse && selectedCourse.codigo === course.codigo}
                isEnrolled={isEnrolled}
                isPrerequisite={selectedCourse && relationships.prerequisites.includes(course.codigo)}
                isSuccessor={selectedCourse && relationships.successors.includes(course.codigo)}
                isSelectable={isSelectable}
              />
            );
          })}
        </div>
      </div>

      {/* Tabla de resumen */}
      {enrolledCourses.length > 0 && (
        <div ref={summaryRef} className="px-0 pb-10">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 mb-3 top-0 rounded-2xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-bold mb-0 ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                <BookCheck className="w-5 h-5 mr-3" />
                Resumen de Cursos Seleccionados
              </h2>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-4`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Código</th>
                    <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Nombre</th>
                    <th className={`px-4 py-3 text-center text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Ciclo</th>
                    <th className={`px-4 py-3 text-center text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tipo</th>
                    <th className={`px-4 py-3 text-center text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Créditos</th>
                    <th className={`px-4 py-3 text-center text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>N° Vez</th>
                    <th className={`px-4 py-3 text-center text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Horas</th>
                    <th className={`px-4 py-3 text-center text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledCourses.map((course, index) => (
                    <tr
                      key={course.codigo}
                      className={`${index % 2 === 0
                          ? isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
                          : isDarkMode ? 'bg-gray-800' : 'bg-white'
                        } border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {course.codigo}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {course.nombre}
                      </td>
                      <td className={`px-4 py-3 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {romanNumerals[course.ciclo - 1]}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${course.tipo === 'EG' ? 'bg-emerald-500' :
                            course.tipo === 'EE' ? 'bg-orange-500' : 'bg-sky-500'
                          }`}>
                          {course.tipo}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-center text-sm font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        {course.creditos}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          course.numero_vez === 1 ? 'bg-green-100 text-green-800' :
                          course.numero_vez === 2 ? 'bg-yellow-100 text-yellow-800' :
                          course.numero_vez === 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.numero_vez === 1 ? '1era' : course.numero_vez === 2 ? '2da' : course.numero_vez === 3 ? '3ra' : '4ta'}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="flex justify-center space-x-1">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">T:{course.hrs_teoria}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">P:{course.hrs_practica}</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">L:{course.hrs_lab}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRemoveCourse(course.codigo)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Eliminar curso"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} font-bold`}>
                    <td colSpan="4" className={`px-4 py-4 text-right text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      Total de créditos:
                    </td>
                    <td className={`px-4 py-4 text-center text-xl ${totalCredits > maxCredits
                        ? 'text-red-600'
                        : isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                      {totalCredits}
                    </td>
                    <td colSpan="3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Botón de prematrícula */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handlePrematricula}
                disabled={enrolledCourses.length === 0 || totalCredits > maxCredits}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                <span className="flex items-center space-x-2">
                  <GraduationCap className="w-6 h-6" />
                  <span>PREMATRICULAR</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación final */}
      {showFinalConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full p-8`}>
            <div className="text-center mb-6">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ¿Está seguro de realizar la prematrícula?
              </h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Esta acción registrará los siguientes {enrolledCourses.length} cursos:
              </p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-6 max-h-60 overflow-y-auto`}>
              <ul className="space-y-2">
                {enrolledCourses.map(course => (
                  <li key={course.codigo} className={`flex justify-between items-center ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <span className="font-medium">{course.nombre}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">({course.creditos} créditos)</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        course.numero_vez === 1 ? 'bg-green-100 text-green-800' :
                        course.numero_vez === 2 ? 'bg-yellow-100 text-yellow-800' :
                        course.numero_vez === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.numero_vez === 1 ? '1era' : course.numero_vez === 2 ? '2da' : course.numero_vez === 3 ? '3ra' : '4ta'} vez
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 mb-6`}>
              <div className="flex justify-between items-center">
                <p className={`font-bold text-lg ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  Total: {totalCredits} créditos de {maxCredits} disponibles
                </p>
                <div className={`px-4 py-2 rounded-full text-white font-bold ${matriculaTypes[calculatedTipoMatricula]?.color}`}>
                  Matrícula {calculatedTipoMatricula}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowFinalConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPrematricula}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Confirmar prematrícula</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}