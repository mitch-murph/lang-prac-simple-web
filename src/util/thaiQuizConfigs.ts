import { createQuizContent } from '../components/QuizApp';
import type { QuizContent } from '../components/QuizApp';
import { alphabetPairs, loadThaiAlphabet } from './alphabetData';

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

export const thaiQuizCategory = {
  id: 'thai',
  name: 'Thai',
  description: 'Practice Thai alphabet',
  quizzes: [
    { id: 'thai-sound-char', name: 'Sound → Character', contentLoader: createThaiSoundToCharQuiz },
    { id: 'thai-char-sound', name: 'Character → Sound', contentLoader: createThaiCharToSoundQuiz },
  ],
};
