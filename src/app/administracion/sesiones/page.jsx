"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminSesiones() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const cargarSesiones = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error cargando sesiones:', error);
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = async (sessionItem) => {
    if (!confirm(`¿Estás seguro de cerrar la sesión de ${sessionItem.usuario.nombres}? El usuario será desconectado inmediatamente.`)) return;

    try {
      const response = await fetch(`/api/admin/sessions?id=${sessionItem.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Sesión cerrada exitosamente. Usuario: ${result.usuario}`);
        cargarSesiones();
        setTimeout(() => {
          cargarSesiones();
        }, 2000);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      alert('Error al cerrar sesión');
    }
  };

  const limpiarSesionesExpiradas = async () => {
    try {
      const response = await fetch('/api/admin/sessions', {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        cargarSesiones();
      }
    } catch (error) {
      console.error('Error limpiando sesiones:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.rol === 'secretaria' || session?.user?.rol === 'director') {
      cargarSesiones();
      const interval = setInterval(cargarSesiones, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  if (loading) return <div className="p-6">Cargando sesiones...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sesiones Activas</h1>
          <p className="text-sm text-gray-600 mt-1">
            Al cerrar una sesión, el usuario será desconectado inmediatamente
          </p>
        </div>
        <button
          onClick={limpiarSesionesExpiradas}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Limpiar Sesiones Expiradas
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Inició
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Expira
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sessions.map((sessionItem) => (
              <tr key={sessionItem.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {sessionItem.usuario.nombres} {sessionItem.usuario.apellido_paterno}
                  </div>
                  <div className="text-sm text-gray-500">
                    {sessionItem.usuario.correo_inst}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${sessionItem.usuario.rol === 'estudiante' ? 'bg-green-100 text-green-800' : 
                      sessionItem.usuario.rol === 'secretaria' ? 'bg-blue-100 text-blue-800' : 
                      'bg-purple-100 text-purple-800'}`}>
                    {sessionItem.usuario.rol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sessionItem.creado_en).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sessionItem.expires).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => cerrarSesion(sessionItem)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Cerrar Sesión
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sessions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay sesiones activas
          </div>
        )}
      </div>
    </div>
  );
}