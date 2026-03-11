import { createQuizContent } from '../components/QuizApp';
import type { QuizContent } from '../components/QuizApp';

export async function createVietnameseAudioToEnglishQuiz(): Promise<QuizContent> {
  const response = await fetch('data/vietnamese-phrases/01/context.csv');
  const csvText = await response.text();
  const lines = csvText.trim().split('\n');
  const mappings = lines.slice(1).map(line => {
    const [english, vietnamese] = line.split(',').map(s => s.replace(/^"|"$/g, '').replace(/"\r/g, '').trim());
    return {
      english,
      vietnamese,
      audio: `data/vietnamese-phrases/01/${english}.mp3`,
    };
  });
  return createQuizContent({
    title: 'Vietnamese: Vietnamese Audio → English Text',
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

export async function createVietnameseTextAudioToVietnameseQuiz(): Promise<QuizContent> {
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
    title: 'Vietnamese: Vietnamese Text → Vietnamese Audio',
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

export async function createVietnameseEnglishTextToVietnameseAudioQuiz(): Promise<QuizContent> {
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
    title: 'Vietnamese: English Text → Vietnamese Audio',
    subtitle: 'See English text, play audio, and select the correct Vietnamese meaning',
    mode: 'character-to-sound',
    fields: [
      {
        name: 'english',
        label: 'Vietnamese',
        audioPathTemplate: (item) => `data/vietnamese-phrases/01/${item.english}.mp3`,
      },
    ],
    mappings,
  });
}

export const vietnameseQuizCategory = {
  id: 'vietnamese',
  name: 'Vietnamese',
  description: 'Practice Vietnamese phrases',
  quizzes: [
    { id: 'vietnamese-audio-english', name: 'Vietnamese Audio → English Text', contentLoader: createVietnameseAudioToEnglishQuiz },
    { id: 'vietnamese-text-audio-vietnamese', name: 'Vietnamese Text → Vietnamese Audio', contentLoader: createVietnameseTextAudioToVietnameseQuiz },
    { id: 'vietnamese-text-audio-english', name: 'English Text → Vietnamese Audio', contentLoader: createVietnameseEnglishTextToVietnameseAudioQuiz },
  ],
};
