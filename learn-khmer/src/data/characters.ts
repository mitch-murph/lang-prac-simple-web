export interface KhmerCharacter {
  id: string;
  character: string;
  audioPath: string;
  audioPath2?: string;
  romanization?: string;
}

// Loaded at runtime from public CSV so audio files align with the same filenames
export async function loadCharacters(base = import.meta.env.BASE_URL): Promise<KhmerCharacter[]> {
  const response = await fetch(`${base}data/khmer-alphabet/content.csv`);
  const text = await response.text();
  const chars = text
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return chars.map((char) => ({
    id: char,
    character: char,
    audioPath: `${base}data/khmer-alphabet/${char}.mp3`,
    audioPath2: `${base}data/khmer-alphabet-2/${char}.mp3`,
  }));
}
