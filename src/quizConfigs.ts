import { createQuizContent } from './QuizApp';
import type { QuizContent } from './QuizApp';
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
        audioPathTemplate: (val) => `data/thai-alphabet/${val}.mp3`,
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
        audioPathTemplate: (val) => `data/thai-alphabet/${val}.mp3`,
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
        audioPathTemplate: (val) => `data/khmer-alphabet/${val}.mp3`,
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
        audioPathTemplate: (val) => `data/khmer-alphabet/${val}.mp3`,
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
        audioPathTemplate: (val) => `data/khmer-alphabet/${val}.mp3`,
      },
      {
        name: 'thai',
        label: 'Thai',
        audioPathTemplate: (val) => `data/thai-alphabet/${val}.mp3`,
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
        audioPathTemplate: (val) => `data/khmer-alphabet/${val}.mp3`,
      },
      {
        name: 'thai',
        label: 'Thai',
        audioPathTemplate: (val) => `data/thai-alphabet/${val}.mp3`,
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
];
