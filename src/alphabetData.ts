// Khmer-Thai alphabet character mappings
export const alphabetPairs = [
  { khmer: 'ក', thai: 'ก' },
  { khmer: 'ខ', thai: 'ข' },
  { khmer: 'ង', thai: 'ง' },
  { khmer: 'ច', thai: 'จ' },
  { khmer: 'ញ', thai: 'ญ' },
  { khmer: 'ដ', thai: 'ด' },
  { khmer: 'ត', thai: 'ต' },
  { khmer: 'ថ', thai: 'ถ' },
  { khmer: 'ន', thai: 'น' },
  { khmer: 'ប', thai: 'บ' },
  { khmer: 'ព', thai: 'ป' },
  { khmer: 'ផ', thai: 'พ' },
  { khmer: 'ម', thai: 'ม' },
  { khmer: 'យ', thai: 'ย' },
  { khmer: 'រ', thai: 'ร' },
  { khmer: 'ល', thai: 'ล' },
  { khmer: 'វ', thai: 'ว' },
  { khmer: 'ស', thai: 'ส' },
  { khmer: 'ហ', thai: 'ห' },
  { khmer: 'អ', thai: 'อ' }
];

// Load CSV data for individual alphabets
async function loadCsvData(path: string): Promise<string[]> {
  const response = await fetch(path);
  const text = await response.text();
  return text.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

export async function loadThaiAlphabet(): Promise<{ thai: string }[]> {
  const chars = await loadCsvData('data/thai-alphabet/content.csv');
  return chars.map(thai => ({ thai }));
}

export async function loadKhmerAlphabet(): Promise<{ khmer: string }[]> {
  const chars = await loadCsvData('data/khmer-alphabet/content.csv');
  return chars.map(khmer => ({ khmer }));
}
