import { createQuizContent } from './QuizApp';
import type { QuizContent } from './QuizApp';
import { alphabetPairs } from './alphabetData';

// 1. Thai sound to character (audio → visual Thai character)
export const thaiSoundToCharQuiz: QuizContent = createQuizContent({
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
  mappings: alphabetPairs.map(p => ({ thai: p.thai })),
});

// 2. Thai character to sound (visual Thai character, can play audio)
export const thaiCharToSoundQuiz: QuizContent = createQuizContent({
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
  mappings: alphabetPairs.map(p => ({ thai: p.thai })),
});

// 3. Khmer sound to character
export const khmerSoundToCharQuiz: QuizContent = createQuizContent({
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
  mappings: alphabetPairs.map(p => ({ khmer: p.khmer })),
});

// 4. Khmer character to sound
export const khmerCharToSoundQuiz: QuizContent = createQuizContent({
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
  mappings: alphabetPairs.map(p => ({ khmer: p.khmer })),
});

// 5. Khmer-Thai paired quiz (original)
export const khmerThaiPairQuiz: QuizContent = createQuizContent({
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

// 6. Khmer-Thai reverse: Character pairs → Sound
export const khmerThaiPairReverseQuiz: QuizContent = createQuizContent({
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

// Export all quiz types
export const quizTypes = [
  { id: 'thai-sound-char', name: 'Thai: Sound → Character', content: thaiSoundToCharQuiz },
  { id: 'thai-char-sound', name: 'Thai: Character → Sound', content: thaiCharToSoundQuiz },
  { id: 'khmer-sound-char', name: 'Khmer: Sound → Character', content: khmerSoundToCharQuiz },
  { id: 'khmer-char-sound', name: 'Khmer: Character → Sound', content: khmerCharToSoundQuiz },
  { id: 'khmer-thai-pair', name: 'Khmer-Thai: Sound → Characters', content: khmerThaiPairQuiz },
  { id: 'khmer-thai-pair-reverse', name: 'Khmer-Thai: Characters → Sound', content: khmerThaiPairReverseQuiz },
];
