import { createQuizContent } from '../components/QuizApp';
import type { QuizContent } from '../components/QuizApp';

async function createVietnameseQuiz({
  setId,
  mode,
  field,
  title,
  subtitle,
}: {
  setId: string;
  mode: 'sound-to-character' | 'character-to-sound';
  field: 'audio' | 'vietnamese' | 'english';
  title: string;
  subtitle: string;
}): Promise<QuizContent> {
  const response = await fetch(`data/vietnamese-phrases/${setId}/content.csv`);
  const csvText = await response.text();
  const lines = csvText.trim().split('\n');
  const mappings = lines.slice(1)
    .filter(line => line.trim() && line.includes(','))
    .map(line => {
      let [english, vietnamese] = line.split(',').map(s => s.replace(/^"|"$/g, '').replace(/\r/g, '').replace(/"$/g, '').trim());
      if (!english || !vietnamese) return null;
      return {
        english,
        vietnamese,
        audio: `data/vietnamese-phrases/${setId}/${english}.mp3`,
      };
    })
    .filter(item => item !== null);
  const fields = [
    {
      name: field,
      label: 'Vietnamese',
      audioPathTemplate: (item: any) => item.audio,
    },
  ];
  return createQuizContent({
    title,
    subtitle,
    mode,
    fields: fields,
    mappings,
  });
}

export function createVietnameseAudioToEnglishQuiz(setId = '01'): Promise<QuizContent> {
  return createVietnameseQuiz({
    setId,
    mode: 'sound-to-character',
    field: 'english',
    title: 'Vietnamese: Vietnamese Audio → English Text',
    subtitle: 'Listen to Vietnamese audio and select the correct English meaning',
  });
}

export function createVietnameseTextAudioToVietnameseQuiz(setId = '01'): Promise<QuizContent> {
  return createVietnameseQuiz({
    setId,
    mode: 'character-to-sound',
    field: 'vietnamese',
    title: 'Vietnamese: Vietnamese Text → Vietnamese Audio',
    subtitle: 'See Vietnamese text, play audio, and select the correct English meaning',
  });
}

export function createVietnameseEnglishTextToVietnameseAudioQuiz(setId = '01'): Promise<QuizContent> {
  return createVietnameseQuiz({
    setId,
    mode: 'character-to-sound',
    field: 'english',
    title: 'Vietnamese: English Text → Vietnamese Audio',
    subtitle: 'See English text, play audio, and select the correct Vietnamese meaning',
  });
}

export const vietnameseQuizCategory = {
  id: 'vietnamese',
  name: 'Vietnamese',
  description: 'Practice Vietnamese phrases',
  quizzes: [
    {
      id: 'vietnamese-audio-english-01',
      name: 'Vietnamese Audio → English Text (Set 01)',
      contentLoader: () => createVietnameseAudioToEnglishQuiz('01'),
    },
    {
      id: 'vietnamese-audio-english-02',
      name: 'Vietnamese Audio → English Text (Set 02)',
      contentLoader: () => createVietnameseAudioToEnglishQuiz('02'),
    },
    {
      id: 'vietnamese-text-audio-vietnamese-01',
      name: 'Vietnamese Text → Vietnamese Audio (Set 01)',
      contentLoader: () => createVietnameseTextAudioToVietnameseQuiz('01'),
    },
    {
      id: 'vietnamese-text-audio-vietnamese-02',
      name: 'Vietnamese Text → Vietnamese Audio (Set 02)',
      contentLoader: () => createVietnameseTextAudioToVietnameseQuiz('02'),
    },
    {
      id: 'vietnamese-text-audio-english-01',
      name: 'English Text → Vietnamese Audio (Set 01)',
      contentLoader: () => createVietnameseEnglishTextToVietnameseAudioQuiz('01'),
    },
    {
      id: 'vietnamese-text-audio-english-02',
      name: 'English Text → Vietnamese Audio (Set 02)',
      contentLoader: () => createVietnameseEnglishTextToVietnameseAudioQuiz('02'),
    },
  ],
};
