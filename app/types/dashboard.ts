export interface SheetData {
  FECHA: string;
  MES: string;
  OPERACIÓN: string;
  CUBETAS: number;
  SELLADAS: number;
  CARTON: number;
  UNIDADES: number;
  NEVERAS: number;
  PLANILLA: string;
  CONDUCTOR: string;
  AUXILIAR: string;
  RUTA: string;
  PUNTOS: number;
  'Retorno neveras': number;
  'retorno cubetas': number;
  '%retorno': number;
}

export interface KPIData {
  totalPlanillas: number;
  cubetasSalieron: number;
  cubetasRetornaron: number;
  neverasAsignadas: number;
  eficiencia: number;
  cubetasPendientes: number;
}

export interface ChartData {
  fecha: string;
  cubetasSalidas: number;
  cubetasRetornadas: number;
}
