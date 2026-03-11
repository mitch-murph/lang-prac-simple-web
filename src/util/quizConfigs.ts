// Vietnamese Phrase 01: Play Vietnamese audio, select English
export async function createVietnameseAudioToEnglishQuiz(): Promise<QuizContent> {
  const response = await fetch('data/vietnamese-phrases/01/context.csv');
  const csvText = await response.text();
  const lines = csvText.trim().split('\n');
  const mappings = lines.slice(1).map(line => {
    const [english, vietnamese] = line.split(',').map(s => s.replace(/^"|"$/g, '').replace(/\"\r/g, '').trim());
    return {
      english,
      vietnamese,
      audio: `data/vietnamese-phrases/01/${english}.mp3`,
    };
  });
  return createQuizContent({
    title: 'Vietnamese: Audio → English',
    subtitle: 'Listen to Vietnamese audio and select the correct English meaning',
    mode: 'sound-to-character',
    fields: [
      {
        name: 'audio',
        label: 'Vietnamese',
        audioPathTemplate: (item) => item.audio,
      },
    ],
    mappings,
  });
}

// Vietnamese Phrase 01: Show Vietnamese text, select English, play audio
export async function createVietnameseTextAudioToEnglishQuiz(): Promise<QuizContent> {
  const response = await fetch('data/vietnamese-phrases/01/context.csv');
  const csvText = await response.text();
  const lines = csvText.trim().split('\n');
  const mappings = lines.slice(1).map(line => {
    const [english, vietnamese] = line.split(',').map(s => s.replace(/^"|"$/g, '').replace(/\r/g, '').replace(/"$/g, '').trim());
    return {
      english,
      vietnamese,
      audio: `data/vietnamese-phrases/01/${english}.mp3`,
    };
  });
  return createQuizContent({
    title: 'Vietnamese: Text + Audio → English',
    subtitle: 'See Vietnamese text, play audio, and select the correct English meaning',
    mode: 'character-to-sound',
    fields: [
      {
        name: 'vietnamese',
        label: 'Vietnamese',
          audioPathTemplate: (item) => `data/vietnamese-phrases/01/${item.english}.mp3`,
      },
    ],
    mappings,
  });
}
// Vietnamese Phrase 01 quiz loader
export async function createVietnamesePhrase01Quiz(): Promise<QuizContent> {
  // Load CSV from public/data/vietnamese-phrases/01/context.csv
  const response = await fetch('data/vietnamese-phrases/01/context.csv');
  const csvText = await response.text();
  // Parse CSV
  const lines = csvText.trim().split('\n');
  const mappings = lines.slice(1).map(line => {
    const [english, vietnamese] = line.split(',').map(s => s.replace(/^"|"$/g, ''));
    return { english, vietnamese };
  });
  return createQuizContent({
    title: 'Phrase 01',
    subtitle: 'Vietnamese Phrases Practice',
    mode: 'sound-to-character', // Use a valid mode
    fields: [
      { name: 'english', label: 'English' },
      { name: 'vietnamese', label: 'Vietnamese' },
    ],
    mappings,
  });
}
import { createQuizContent } from '../components/QuizApp';
import type { QuizContent } from '../components/QuizApp';
import { alphabetPairs, loadThaiAlphabet, loadKhmerAlphabet } from './alphabetData';

// 1. Thai sound to character (audio → visual Thai character)
export async function createThaiSoundToCharQuiz(): Promise<QuizContent> {
  const mappings = await loadThaiAlphabet();
  return createQuizContent({
    title: 'Thai: Sound → Character',
    subtitle: 'Listen to the Thai audio and select the correct character',
    mode: 'sound-to-character',
    fields: [
      {
        name: 'thai',
        label: 'Thai',
          audioPathTemplate: (item) => `data/thai-alphabet/${item.thai}.mp3`,
      },
    ],
    mappings,
  });
}

// 2. Thai character to sound (visual Thai character, can play audio)
export async function createThaiCharToSoundQuiz(): Promise<QuizContent> {
  const mappings = await loadThaiAlphabet();
  return createQuizContent({
    title: 'Thai: Character → Sound',
    subtitle: 'See the Thai character and identify it by playing audio',
    mode: 'character-to-sound',
    fields: [
      {
        name: 'thai',
        label: 'Thai',
        audioPathTemplate: (item) => `data/thai-alphabet/${item.thai}.mp3`,
      },
    ],
    mappings,
  });
}

// 3. Khmer sound to character
export async function createKhmerSoundToCharQuiz(): Promise<QuizContent> {
  const mappings = await loadKhmerAlphabet();
  return createQuizContent({
    title: 'Khmer: Sound → Character',
    subtitle: 'Listen to the Khmer audio and select the correct character',
    mode: 'sound-to-character',
    fields: [
      {
        name: 'khmer',
        label: 'Khmer',
          audioPathTemplate: (item) => `data/khmer-alphabet/${item.khmer}.mp3`,
      },
    ],
    mappings,
  });
}

// 4. Khmer character to sound
export async function createKhmerCharToSoundQuiz(): Promise<QuizContent> {
  const mappings = await loadKhmerAlphabet();
  return createQuizContent({
    title: 'Khmer: Character → Sound',
    subtitle: 'See the Khmer character and identify it by playing audio',
    mode: 'character-to-sound',
    fields: [
      {
        name: 'khmer',
        label: 'Khmer',
        audioPathTemplate: (item) => `data/khmer-alphabet/${item.khmer}.mp3`,
      },
    ],
    mappings,
  });
}

// 5. Khmer-Thai paired quiz (original)
export async function createKhmerThaiPairQuiz(): Promise<QuizContent> {
  return createQuizContent({
    title: 'Khmer-Thai Alphabet Quiz',
    subtitle: 'Listen to the audio and select the correct pair',
    mode: 'sound-to-character',
    fields: [
      {
        name: 'khmer',
        label: 'Khmer',
          audioPathTemplate: (item) => `data/khmer-alphabet/${item.khmer}.mp3`,
      },
      {
        name: 'thai',
        label: 'Thai',
          audioPathTemplate: (item) => `data/thai-alphabet/${item.thai}.mp3`,
      },
    ],
    mappings: alphabetPairs,
  });
}

// 6. Khmer-Thai reverse: Character pairs → Sound
export async function createKhmerThaiPairReverseQuiz(): Promise<QuizContent> {
  return createQuizContent({
    title: 'Khmer-Thai: Character → Sound',
    subtitle: 'See the character pairs and identify by playing audio',
    mode: 'character-to-sound',
    fields: [
      {
        name: 'khmer',
        label: 'Khmer',
        audioPathTemplate: (item) => `data/khmer-alphabet/${item.khmer}.mp3`,
      },
      {
        name: 'thai',
        label: 'Thai',
        audioPathTemplate: (item) => `data/thai-alphabet/${item.thai}.mp3`,
      },
    ],
    mappings: alphabetPairs,
  });
}

// Quiz category structure
export interface QuizCategory {
  id: string;
  name: string;
  description?: string;
  quizzes: {
    id: string;
    name: string;
    contentLoader: () => Promise<QuizContent>;
  }[];
}

export const quizCategories: QuizCategory[] = [
  {
    id: 'thai',
    name: 'Thai',
    description: 'Practice Thai alphabet',
    quizzes: [
      { id: 'thai-sound-char', name: 'Sound → Character', contentLoader: createThaiSoundToCharQuiz },
      { id: 'thai-char-sound', name: 'Character → Sound', contentLoader: createThaiCharToSoundQuiz },
    ],
  },
  {
    id: 'khmer',
    name: 'Khmer',
    description: 'Practice Khmer alphabet',
    quizzes: [
      { id: 'khmer-sound-char', name: 'Sound → Character', contentLoader: createKhmerSoundToCharQuiz },
      { id: 'khmer-char-sound', name: 'Character → Sound', contentLoader: createKhmerCharToSoundQuiz },
    ],
  },
  {
    id: 'khmer-thai-pairs',
    name: 'Khmer-Thai Pairs',
    description: 'Practice both alphabets together',
    quizzes: [
      { id: 'khmer-thai-pair', name: 'Sound → Characters', contentLoader: createKhmerThaiPairQuiz },
      { id: 'khmer-thai-pair-reverse', name: 'Characters → Sound', contentLoader: createKhmerThaiPairReverseQuiz },
    ],
  },
  {
    id: 'vietnamese',
    name: 'Vietnamese',
    description: 'Practice Vietnamese phrases',
    quizzes: [
      { id: 'vietnamese-audio-english', name: 'Audio → English', contentLoader: createVietnameseAudioToEnglishQuiz },
      { id: 'vietnamese-text-audio-english', name: 'Text + Audio → English', contentLoader: createVietnameseTextAudioToEnglishQuiz },
    ],
  },
];
