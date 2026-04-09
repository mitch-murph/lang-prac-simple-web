import { createQuizContent } from '../components/QuizApp';
import type { QuizContent } from '../components/QuizApp';
import { alphabetPairs, loadKhmerAlphabet } from './alphabetData';

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
export async function createKhmerHandwritingQuiz(): Promise<{ title: string; subtitle: string; handwriting: true; items: { khmer: string; audio: string }[] }> {
  const mappings = await loadKhmerAlphabet();
  return {
    title: 'Khmer: Handwriting Practice',
    subtitle: 'Listen to the audio and write the character on the canvas',
    handwriting: true,
    items: mappings.map(item => ({
      khmer: item.khmer,
      audio: `data/khmer-alphabet/${item.khmer}.mp3`,
    })),
  };
}

export const khmerQuizCategory = {
  id: 'khmer',
  name: 'Khmer',
  description: 'Practice Khmer alphabet',
  quizzes: [
    { id: 'khmer-sound-char', name: 'Sound → Character', contentLoader: createKhmerSoundToCharQuiz },
    { id: 'khmer-char-sound', name: 'Character → Sound', contentLoader: createKhmerCharToSoundQuiz },
    { id: 'khmer-handwriting', name: 'Handwriting Practice', contentLoader: createKhmerHandwritingQuiz },
  ],
};

export const khmerThaiPairsQuizCategory = {
  id: 'khmer-thai-pairs',
  name: 'Khmer-Thai Pairs',
  description: 'Practice both alphabets together',
  quizzes: [
    { id: 'khmer-thai-pair', name: 'Sound → Characters', contentLoader: createKhmerThaiPairQuiz },
    { id: 'khmer-thai-pair-reverse', name: 'Characters → Sound', contentLoader: createKhmerThaiPairReverseQuiz },
  ],
};
