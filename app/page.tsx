'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Package, 
  RotateCcw, 
  Snowflake, 
  TrendingUp, 
  Clock,
  RefreshCw
} from 'lucide-react';

import { SheetData, KPIData, ChartData } from './types/dashboard';
import { fetchSheetData } from './utils/googleSheets';
import { calculateKPIs, prepareChartData } from './utils/calculations';
import KPICard from './components/KPICard';
import DateFilter from './components/DateFilter';
import CubetasChart from './components/CubetasChart';
import LoadingSpinner from './components/LoadingSpinner';

export default function Dashboard() {
  const [data, setData] = useState<SheetData[]>([]);
  const [kpis, setKpis] = useState<KPIData>({
    totalPlanillas: 0,
    cubetasSalieron: 0,
    cubetasRetornaron: 0,
    neverasAsignadas: 0,
    eficiencia: 0,
    cubetasPendientes: 0
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dateFilter, setDateFilter] = useState<{start: Date | null, end: Date | null}>({
    start: null,
    end: null
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const sheetData = await fetchSheetData();
      setData(sheetData);
      
      const calculatedKPIs = calculateKPIs(sheetData, dateFilter.start || undefined, dateFilter.end || undefined);
      setKpis(calculatedKPIs);
      
      const chartData = prepareChartData(sheetData, dateFilter.start || undefined, dateFilter.end || undefined);
      setChartData(chartData);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const calculatedKPIs = calculateKPIs(data, dateFilter.start || undefined, dateFilter.end || undefined);
      setKpis(calculatedKPIs);
      
      const chartData = prepareChartData(data, dateFilter.start || undefined, dateFilter.end || undefined);
      setChartData(chartData);
    }
  }, [dateFilter, data]);

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setDateFilter({ start: startDate, end: endDate });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Ferricar</h1>
            <p className="text-slate-400">
              Última actualización: {lastUpdated.toLocaleString('es-ES')}
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>

        {/* Date Filter */}
        <div className="mb-8">
          <DateFilter onDateChange={handleDateChange} />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <KPICard
            title="Total Planillas"
            value={kpis.totalPlanillas}
            icon={FileText}
          />
          <KPICard
            title="Cubetas Salieron"
            value={kpis.cubetasSalieron}
            icon={Package}
          />
          <KPICard
            title="Cubetas Retornaron"
            value={kpis.cubetasRetornaron}
            icon={RotateCcw}
          />
          <KPICard
            title="Neveras Asignadas"
            value={kpis.neverasAsignadas}
            icon={Snowflake}
          />
          <KPICard
            title="Eficiencia"
            value={kpis.eficiencia}
            icon={TrendingUp}
            format="percentage"
          />
          <KPICard
            title="Cubetas Pendientes"
            value={kpis.cubetasPendientes}
            icon={Clock}
          />
        </div>

        {/* Chart */}
        <div className="mb-8">
          <CubetasChart data={chartData} />
        </div>

        {/* Data Summary */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Resumen de Datos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Total de registros:</span>
              <span className="text-white ml-2 font-medium">{data.length}</span>
            </div>
            <div>
              <span className="text-slate-400">Rango de fechas:</span>
              <span className="text-white ml-2 font-medium">
                {dateFilter.start && dateFilter.end 
                  ? `${dateFilter.start.toLocaleDateString('es-ES')} - ${dateFilter.end.toLocaleDateString('es-ES')}`
                  : 'Todos los datos'
                }
              </span>
            </div>
            <div>
              <span className="text-slate-400">Fuente:</span>
              <span className="text-white ml-2 font-medium">Google Sheets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
