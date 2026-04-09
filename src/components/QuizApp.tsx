import React from 'react';
import SoundToCharacterQuiz from './SoundToCharacterQuiz';
import CharacterToSoundQuiz from './CharacterToSoundQuiz';
import KhmerHandwritingQuiz from './KhmerHandwritingQuiz';

interface HandwritingContent {
  title: string;
  subtitle: string;
  handwriting: true;
  items: { khmer: string; audio: string }[];
}

const KhmerHandwritingQuizPage: React.FC<{ content: HandwritingContent }> = ({ content }) => {
  const [current, setCurrent] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [items] = React.useState(() => [...content.items].sort(() => Math.random() - 0.5));

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % items.length);
    setShowAnswer(false);
  };

  return (
    <KhmerHandwritingQuiz
      key={current}
      audioSrc={items[current].audio}
      correctCharacter={items[current].khmer}
      showAnswer={showAnswer}
      setShowAnswer={setShowAnswer}
      onNext={handleNext}
      progress={`${current + 1} / ${items.length}`}
    />
  );
};

// Generic quiz types
export interface QuizItem {
  id: string;
  [fieldName: string]: string; // field values, e.g., khmer: 'áž€', thai: 'à¸'
}

export interface QuizField {
  name: string; // field name, e.g., 'khmer'
  label: string; // display label for audio button, e.g., 'Khmer'
  audioPathTemplate?: (item: QuizItem) => string; // e.g., (item) => `data/khmer-alphabet/${item.khmer}.mp3`
}

export interface QuizContent {
  title: string;
  subtitle: string;
  items: QuizItem[];
  fields: QuizField[];
  mode: 'sound-to-character' | 'character-to-sound'; // How to present the quiz
}

// Factory helper to create QuizContent from simple mappings
export function createQuizContent(config: {
  title: string;
  subtitle: string;
  mode: 'sound-to-character' | 'character-to-sound';
  fields: Array<{
    name: string;
    label: string;
    audioPathTemplate?: (item: QuizItem) => string;
  }>;
  mappings: Array<Record<string, string>>;
}): QuizContent {
  const items: QuizItem[] = config.mappings.map((mapping, index) => ({
    id: `item-${index}`,
    ...mapping,
  }));

  return {
    title: config.title,
    subtitle: config.subtitle,
    items,
    fields: config.fields,
    mode: config.mode,
  };
}

interface QuizAppProps {
  content: QuizContent;
}


const QuizApp: React.FC<QuizAppProps> = ({ content }) => {
  if ((content as any).handwriting) {
    return <KhmerHandwritingQuizPage content={content as any} />;
  }
  if (content.mode === 'sound-to-character') {
    return <SoundToCharacterQuiz content={content} />;
  } else if (content.mode === 'character-to-sound') {
    return <CharacterToSoundQuiz content={content} />;
  } else {
    return <div>Unsupported quiz mode</div>;
  }
};

export default QuizApp;
