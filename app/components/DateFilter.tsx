import { useState } from 'react';
import { Calendar, ListFilter as Filter } from 'lucide-react';

interface DateFilterProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

export default function DateFilter({ onDateChange }: DateFilterProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    const start = date ? new Date(date) : null;
    const end = endDate ? new Date(endDate) : null;
    onDateChange(start, end);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    const start = startDate ? new Date(startDate) : null;
    const end = date ? new Date(date) : null;
    onDateChange(start, end);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    onDateChange(null, null);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Filtros de Fecha</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Fecha Inicio
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Fecha Fin
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors duration-200"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
