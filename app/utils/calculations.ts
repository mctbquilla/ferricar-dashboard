import { SheetData, KPIData, ChartData } from '../types/dashboard';
import { format, parseISO, isWithinInterval, isValid } from 'date-fns';

export function calculateKPIs(data: SheetData[], startDate?: Date, endDate?: Date): KPIData {
  let filteredData = data;
  
  if (startDate && endDate) {
    filteredData = data.filter(row => {
      try {
        const rowDate = parseISO(row.FECHA);
        return isWithinInterval(rowDate, { start: startDate, end: endDate });
      } catch {
        return true;
      }
    });
  }
  
  const totalPlanillas = new Set(filteredData.map(row => row.PLANILLA)).size;
  const cubetasSalieron = filteredData.reduce((sum, row) => sum + (row.CUBETAS || 0), 0);
  const cubetasRetornaron = filteredData.reduce((sum, row) => sum + (row['retorno cubetas'] || 0), 0);
  const neverasAsignadas = filteredData.reduce((sum, row) => sum + (row.NEVERAS || 0), 0);
  
  const validReturnRates = filteredData
    .map(row => row['%retorno'])
    .filter(rate => !isNaN(rate) && rate > 0);
  
  const eficiencia = validReturnRates.length > 0 
    ? validReturnRates.reduce((sum, rate) => sum + rate, 0) / validReturnRates.length
    : 0;
  
  const cubetasPendientes = cubetasSalieron - cubetasRetornaron;
  
  return {
    totalPlanillas,
    cubetasSalieron,
    cubetasRetornaron,
    neverasAsignadas,
    eficiencia,
    cubetasPendientes
  };
}

export function prepareChartData(data: SheetData[], startDate?: Date, endDate?: Date): ChartData[] {
  let filteredData = data;
  
  if (startDate && endDate) {
    filteredData = data.filter(row => {
      try {
        const rowDate = parseISO(row.FECHA);
        return isWithinInterval(rowDate, { start: startDate, end: endDate });
      } catch {
        return true;
      }
    });
  }
  
  const groupedByDate = filteredData.reduce((acc, row) => {
    const fecha = row.FECHA;
    if (!acc[fecha]) {
      acc[fecha] = {
        cubetasSalidas: 0,
        cubetasRetornadas: 0
      };
    }
    
    acc[fecha].cubetasSalidas += row.CUBETAS || 0;
    acc[fecha].cubetasRetornadas += row['retorno cubetas'] || 0;
    
    return acc;
  }, {} as Record<string, { cubetasSalidas: number; cubetasRetornadas: number }>);
  
  return Object.entries(groupedByDate)
    .map(([fecha, values]) => ({
      fecha: isValid(parseISO(fecha)) ? format(parseISO(fecha), 'dd/MM') : fecha,
      cubetasSalidas: values.cubetasSalidas,
      cubetasRetornadas: values.cubetasRetornadas
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}
