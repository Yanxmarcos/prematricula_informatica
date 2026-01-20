import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DistribucionCiclosChart = ({ data, isDarkMode = false }) => {
  // Preparar datos para el gráfico
  const chartData = data.map(ciclo => ({
    ciclo: `Ciclo ${ciclo.ciclo}`,
    cursos: ciclo.total_cursos,
    estudiantes: ciclo.total_prematriculados
  }));

  return (
    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Distribución por Ciclo
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isDarkMode 
            ? 'bg-green-900 text-green-200 border-green-700' 
            : 'bg-green-100 text-green-800 border-green-200'
        } border`}>
          Por Ciclo
        </span>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
          />
          <XAxis 
            dataKey="ciclo"
            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fill: isDarkMode ? '#d1d5db' : '#4b5563' }}
          />
          <YAxis 
            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fill: isDarkMode ? '#d1d5db' : '#4b5563' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              borderColor: isDarkMode ? '#374151' : '#e5e7eb',
              borderRadius: '8px',
            }}
            itemStyle={{ color: isDarkMode ? '#f3f4f6' : '#111827' }}
            labelStyle={{ 
              color: isDarkMode ? '#f3f4f6' : '#111827',
              fontWeight: 'bold'
            }}
            formatter={(value, name) => {
              if (name === 'cursos') return [value, 'Cursos'];
              if (name === 'estudiantes') return [value, 'Estudiantes'];
              return [value, name];
            }}
          />
          <Legend 
            wrapperStyle={{
              color: isDarkMode ? '#d1d5db' : '#4b5563',
              paddingTop: '20px'
            }}
          />
          <Bar 
            dataKey="cursos" 
            name="Total Cursos"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Bar 
            dataKey="estudiantes" 
            name="Estudiantes Prematriculados"
            fill="#82ca9d"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Información adicional */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
          <p className={`font-semibold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            Resumen por Ciclo
          </p>
          <div className="mt-2 space-y-2">
            {data.map(ciclo => (
              <div key={ciclo.ciclo} className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Ciclo {ciclo.ciclo}:
                </span>
                <div className="flex gap-4">
                  <span className={isDarkMode ? 'text-purple-300' : 'text-purple-600'}>
                    {ciclo.total_cursos} cursos
                  </span>
                  <span className={isDarkMode ? 'text-green-300' : 'text-green-600'}>
                    {ciclo.total_prematriculados} est.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
          <p className={`font-semibold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            Totales Generales
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Total Cursos:</span>
              <span className={`font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                {data.reduce((sum, ciclo) => sum + ciclo.total_cursos, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Total Estudiantes:</span>
              <span className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                {data.reduce((sum, ciclo) => sum + ciclo.total_prematriculados, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistribucionCiclosChart;