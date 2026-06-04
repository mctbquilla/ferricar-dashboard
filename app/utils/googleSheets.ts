import axios from 'axios';
import { SheetData } from '../types/dashboard';

const SHEET_ID = '17rAebJx_WwaCg4Da7WIVgv6-7F5kCCbu0SusABJP_mY';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

export async function fetchSheetData(): Promise<SheetData[]> {
  try {
    const response = await axios.get(SHEET_URL);
    const csvData = response.data;

    const lines = csvData.split('\n');
    const headers: string[] = lines[0].split(',').map((header: string) => header.replace(/"/g, '').trim());

    const data: SheetData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') continue;

      const values: string[] = line.split(',').map((value: string) => value.replace(/"/g, '').trim());

      if (values.length >= headers.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const row: any = {};

        headers.forEach((header: string, index: number) => {
          const value = values[index];
          if (['CUBETAS', 'SELLADAS', 'CARTON', 'UNIDADES', 'NEVERAS', 'PUNTOS', 'Retorno neveras', 'retorno cubetas'].includes(header)) {
            row[header] = parseFloat(value) || 0;
          } else if (header === '%retorno') {
            row[header] = parseFloat(value) || 0;
          } else {
            row[header] = value;
          }
        });

        data.push(row as SheetData);
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}
