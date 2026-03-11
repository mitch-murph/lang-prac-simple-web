import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { QuizContent, QuizItem } from './QuizApp';

interface BaseQuizProps {
  content: QuizContent;
  children: (props: {
    currentItem: QuizItem | null;
    options: QuizItem[];
    selectedOption: QuizItem | null;
    score: number;
    isPlaying: string | null;
    handleAnswer: (answer: QuizItem) => void;
    playAudio: (identifier: string, targetItem?: QuizItem) => void;
    loadNewQuestion: () => void;
  }) => React.ReactNode;
}

const BaseQuiz: React.FC<BaseQuizProps> = ({ content, children }) => {
  const [currentItem, setCurrentItem] = useState<QuizItem | null>(null);
  const [options, setOptions] = useState<QuizItem[]>([]);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuizItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadNewQuestion = useCallback(() => {
    const randomItem = content.items[Math.floor(Math.random() * content.items.length)];
    setCurrentItem(randomItem);
    const wrongAnswers = content.items
      .filter((item) => item.id !== randomItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const allOptions = [...wrongAnswers, randomItem].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedOption(null);
  }, [content]);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  const isSameItem = (a: QuizItem | null | undefined, b: QuizItem | null | undefined) =>
    !!a && !!b && a.id === b.id;

  const handleAnswer = useCallback(
    (answer: QuizItem) => {
      if (!currentItem) return;
      setSelectedOption(answer);
      if (isSameItem(answer, currentItem)) {
        setScore((prev) => prev + 1);
      }
      setTimeout(() => {
        loadNewQuestion();
      }, 1000);
    },
    [currentItem, loadNewQuestion]
  );

  const playAudio = useCallback(
    (identifier: string, targetItem?: QuizItem) => {
      if (isPlaying === identifier) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setIsPlaying(null);
        return;
      }
      const fieldName = identifier.includes('-') ? identifier.split('-')[0] : identifier;
      const itemToPlay = targetItem || currentItem;
      if (itemToPlay) {
        const field = content.fields.find((f) => f.name === fieldName);
        if (field && field.audioPathTemplate) {
          const audioPath = field.audioPathTemplate(itemToPlay);
          const audio = new Audio(audioPath);
          audioRef.current = audio;
          audio.play();
          setIsPlaying(identifier);
          audio.onended = () => {
            setIsPlaying(null);
            audioRef.current = null;
          };
        }
      }
    },
    [currentItem, isPlaying, content]
  );

  return (
    <>{children({
      currentItem,
      options,
      selectedOption,
      score,
      isPlaying,
      handleAnswer,
      playAudio,
      loadNewQuestion,
    })}</>
  );
};

export default BaseQuiz;
