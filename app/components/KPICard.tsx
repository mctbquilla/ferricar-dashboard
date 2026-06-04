'use client';
import { LucideProps } from 'lucide-react';
import { ComponentType } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ComponentType<LucideProps>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  format?: 'number' | 'percentage';
}

export default function KPICard({ title, value, icon: Icon, trend, format = 'number' }: KPICardProps) {
  const formatValue = (val: string | number) => {
    if (format === 'percentage') {
      return `${Number(val).toFixed(1)}%`;
    }
    return typeof val === 'number' ? val.toLocaleString() : val;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-600 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">{formatValue(value)}</p>
      </div>
    </div>
  );
}
