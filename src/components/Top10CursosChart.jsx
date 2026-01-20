import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Top10CursosChart = ({ data, isDarkMode = false }) => {
  // Colores basados en el ranking
  const getBarColor = (index) => {
    switch (index) {
      case 0: return '#fbbf24'; // Oro
      case 1: return '#9ca3af'; // Plata
      case 2: return '#ea580c'; // Bronce
      default: return isDarkMode ? '#3b82f6' : '#2563eb'; // Azul
    }
  };

  const chartData = data.map((curso, index) => ({
    ...curso,
    ranking: index + 1,
    fill: getBarColor(index),
    nombreCorto: curso.nombre.length > 30 
      ? curso.nombre.substring(0, 30) + '...' 
      : curso.nombre
  }));

  return (
    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Top 10 Cursos Con Más Prematriculados
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isDarkMode 
            ? 'bg-blue-900 text-blue-200 border-blue-700' 
            : 'bg-blue-100 text-blue-800 border-blue-200'
        } border`}>
          10 Cursos
        </span>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
          layout="vertical"
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
          />
          <XAxis 
            type="number"
            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fill: isDarkMode ? '#d1d5db' : '#4b5563' }}
          />
          <YAxis 
            type="category" 
            dataKey="nombreCorto"
            width={150}
            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
            tick={{ 
              fill: isDarkMode ? '#d1d5db' : '#4b5563',
              fontSize: 12 
            }}
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
              fontWeight: 'bold',
              marginBottom: '8px'
            }}
            formatter={(value) => [value, 'Prematriculados']}
          />
          <Legend />
          <Bar 
            dataKey="total_prematriculados" 
            name="Total Prematriculados"
            radius={[0, 4, 4, 0]}
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Leyenda de colores */}
      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>1° Lugar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>2° Lugar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>3° Lugar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Otros</span>
        </div>
      </div>
    </div>
  );
};

export default Top10CursosChart;