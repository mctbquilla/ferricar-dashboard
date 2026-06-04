'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types/dashboard';

interface CubetasChartProps {
  data: ChartData[];
}

export default function CubetasChart({ data }: CubetasChartProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6">Cubetas Salidas vs Retornadas por Día</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="fecha" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="cubetasSalidas" stroke="#3B82F6" strokeWidth={3} name="Cubetas Salidas" dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="cubetasRetornadas" stroke="#10B981" strokeWidth={3} name="Cubetas Retornadas" dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
