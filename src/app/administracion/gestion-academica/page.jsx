"use client";
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Calendar, Plus, Edit, Trash2, Power } from 'lucide-react';

export default function GestionFechasAcademicas() {
  const { isDarkMode } = useApp();
  const [fechas, setFechas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaEditando, setFechaEditando] = useState(null);
  const [formData, setFormData] = useState({
    semestre: '',
    tipo: 'prematricula',
    fecha_inicio: '',
    fecha_fin: '',
    activo: false
  });

  const themeClasses = {
    cardBg: isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200",
    text: isDarkMode ? "text-white" : "text-slate-800",
    textSecondary: isDarkMode ? "text-gray-400" : "text-slate-600",
    inputBg: isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-slate-800",
    buttonPrimary: isDarkMode
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white",
    buttonSecondary: isDarkMode
      ? "bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
      : "bg-white hover:bg-gray-50 text-slate-700 border-gray-300",
    tableBorder: isDarkMode ? "border-slate-700" : "border-gray-200",
    tableHeaderBg: isDarkMode ? "bg-slate-700" : "bg-gray-50",
    badgeGreen: isDarkMode ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-green-100 text-green-700 border-green-200",
    badgeBlue: isDarkMode ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-100 text-blue-700 border-blue-200",
    badgeGray: isDarkMode ? "bg-gray-500/20 text-gray-300 border-gray-500/30" : "bg-gray-100 text-gray-700 border-gray-200",
  };

  // Cargar fechas académicas
  const cargarFechas = async () => {
    try {
      const response = await fetch('/api/admin/fechas-academicas');
      const data = await response.json();
      if (data.success) {
        setFechas(data.data);
      }
    } catch (error) {
      console.error('Error al cargar fechas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFechas();
  }, []);

  // Abrir modal para nueva fecha
  const abrirModalNuevo = (tipo) => {
    setFormData({
      semestre: '',
      tipo,
      fecha_inicio: '',
      fecha_fin: '',
      activo: false
    });
    setFechaEditando(null);
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (fecha) => {
    setFormData({
      semestre: fecha.semestre,
      tipo: fecha.tipo,
      fecha_inicio: fecha.fecha_inicio.split('T')[0],
      fecha_fin: fecha.fecha_fin.split('T')[0],
      activo: fecha.activo
    });
    setFechaEditando(fecha);
    setModalAbierto(true);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const url = fechaEditando 
        ? `/api/admin/fechas-academicas/${fechaEditando.id}`
        : '/api/admin/fechas-academicas';
      
      const method = fechaEditando ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setModalAbierto(false);
        cargarFechas();
      }
    } catch (error) {
      console.error('Error al guardar fecha:', error);
    }
  };

  // Cambiar estado activo
  const cambiarEstado = async (id, activo) => {
    try {
      const fecha = fechas.find(f => f.id === id);
      const response = await fetch(`/api/admin/fechas-academicas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...fecha,
          activo: !activo,
          fecha_inicio: fecha.fecha_inicio,
          fecha_fin: fecha.fecha_fin
        }),
      });

      const data = await response.json();
      if (data.success) {
        cargarFechas();
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  // Eliminar fecha
  const eliminarFecha = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta fecha académica?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/fechas-academicas/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        cargarFechas();
      }
    } catch (error) {
      console.error('Error al eliminar fecha:', error);
    }
  };

  // Filtrar fechas por tipo
  const fechasPrematricula = fechas.filter(f => f.tipo === 'prematricula');
  const fechasSemestre = fechas.filter(f => f.tipo === 'semestre');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-center">
          <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
          <p className={`mt-2 text-sm ${themeClasses.text}`}>Cargando fechas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
          Gestión de Periodos Académicos
        </h1>
        <p className={`mt-2 ${themeClasses.textSecondary}`}>
          Configura las fechas de prematrícula y semestre
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Columna Prematrícula */}
        <div className={`p-6 rounded-xl border ${themeClasses.cardBg} shadow-lg`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${themeClasses.text}`}>
              Prematrícula
            </h2>
            <button
              onClick={() => abrirModalNuevo('prematricula')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${themeClasses.buttonPrimary} hover:scale-105`}
            >
              <Plus className="w-4 h-4" />
              Nueva Fecha
            </button>
          </div>

          <TablaFechas
            fechas={fechasPrematricula}
            onEditar={abrirModalEditar}
            onCambiarEstado={cambiarEstado}
            onEliminar={eliminarFecha}
            themeClasses={themeClasses}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Columna Semestre */}
        <div className={`p-6 rounded-xl border ${themeClasses.cardBg} shadow-lg`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${themeClasses.text}`}>
              Semestre
            </h2>
            <button
              onClick={() => abrirModalNuevo('semestre')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${themeClasses.buttonPrimary} hover:scale-105`}
            >
              <Plus className="w-4 h-4" />
              Nueva Fecha
            </button>
          </div>

          <TablaFechas
            fechas={fechasSemestre}
            onEditar={abrirModalEditar}
            onCambiarEstado={cambiarEstado}
            onEliminar={eliminarFecha}
            themeClasses={themeClasses}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Modal para agregar/editar */}
      {modalAbierto && (
        <ModalFecha
          formData={formData}
          setFormData={setFormData}
          fechaEditando={fechaEditando}
          onClose={() => setModalAbierto(false)}
          onSubmit={manejarEnvio}
          themeClasses={themeClasses}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

function TablaFechas({ fechas, onEditar, onCambiarEstado, onEliminar, themeClasses, isDarkMode }) {
  if (fechas.length === 0) {
    return (
      <div className={`text-center py-8 ${themeClasses.textSecondary}`}>
        <Calendar className="mx-auto h-12 w-12 mb-3 opacity-50" />
        <p>No hay fechas configuradas</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${themeClasses.tableBorder} overflow-hidden`}>
      <table className="w-full">
        <thead className={themeClasses.tableHeaderBg}>
          <tr>
            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${themeClasses.text}`}>
              Semestre
            </th>
            <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${themeClasses.text}`}>
              Fechas
            </th>
            <th className={`px-4 py-3 text-center text-xs font-semibold uppercase ${themeClasses.text}`}>
              Estado
            </th>
            <th className={`px-4 py-3 text-center text-xs font-semibold uppercase ${themeClasses.text}`}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-opacity-10">
          {fechas.map((fecha) => (
            <tr key={fecha.id} className="hover:bg-opacity-50 transition-colors">
              <td className={`px-4 py-3 ${themeClasses.text} font-medium`}>
                {fecha.semestre}
              </td>
              <td className={`px-4 py-3 ${themeClasses.textSecondary} text-sm`}>
                <div>Inicio: {new Date(fecha.fecha_inicio).toLocaleDateString('es-PE')}</div>
                <div>Fin: {new Date(fecha.fecha_fin).toLocaleDateString('es-PE')}</div>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onCambiarEstado(fecha.id, fecha.activo)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    fecha.activo 
                      ? themeClasses.badgeGreen
                      : themeClasses.badgeGray
                  } hover:scale-105`}
                >
                  <Power className="w-3 h-3" />
                  {fecha.activo ? 'Activo' : 'Inactivo'}
                </button>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEditar(fecha)}
                    className={`p-2 rounded-lg transition-all ${
                      isDarkMode 
                        ? 'hover:bg-slate-700 text-blue-400' 
                        : 'hover:bg-gray-100 text-blue-600'
                    } hover:scale-105`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEliminar(fecha.id)}
                    className={`p-2 rounded-lg transition-all ${
                      isDarkMode 
                        ? 'hover:bg-slate-700 text-red-400' 
                        : 'hover:bg-gray-100 text-red-600'
                    } hover:scale-105`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModalFecha({ formData, setFormData, fechaEditando, onClose, onSubmit, themeClasses, isDarkMode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        className={`w-full max-w-md rounded-2xl border ${themeClasses.cardBg} shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <h3 className={`text-xl font-semibold ${themeClasses.text}`}>
            {fechaEditando ? 'Editar Fecha' : 'Nueva Fecha Académica'}
          </h3>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
              Semestre
            </label>
            <input
              type="text"
              required
              value={formData.semestre}
              onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
              placeholder="Ej: 2024-I, 2024-II"
              className={`w-full px-3 py-2 rounded-lg border ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
              Tipo
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="prematricula">Prematrícula</option>
              <option value="semestre">Semestre</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                Fecha Inicio
              </label>
              <input
                type="date"
                required
                value={formData.fecha_inicio}
                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                Fecha Fin
              </label>
              <input
                type="date"
                required
                value={formData.fecha_fin}
                onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="activo" className={`text-sm ${themeClasses.text}`}>
              Activar esta fecha
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${themeClasses.buttonPrimary} hover:scale-105`}
            >
              {fechaEditando ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-lg font-medium border transition-all ${themeClasses.buttonSecondary}`}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}