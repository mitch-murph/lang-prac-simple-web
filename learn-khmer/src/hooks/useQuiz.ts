import { useState, useCallback, useEffect } from 'react';
import type { KhmerCharacter } from '../data/characters';

export type QuizItem = KhmerCharacter;

export interface UseQuizOptions {
  items: QuizItem[];
  numOptions?: number;
}

export interface UseQuizReturn {
  currentItem: QuizItem | null;
  options: QuizItem[];
  selectedOption: QuizItem | null;
  isCorrect: boolean | null;
  score: number;
  total: number;
  handleAnswer: (item: QuizItem) => void;
  next: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function useQuiz({ items, numOptions = 4 }: UseQuizOptions): UseQuizReturn {
  const [queue, setQueue] = useState<QuizItem[]>(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<QuizItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<QuizItem | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  // Re-shuffle when items list changes (e.g. settings update)
  useEffect(() => {
    setQueue(shuffle(items));
    setIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
  }, [items]);

  // Build options whenever queue or index changes
  useEffect(() => {
    if (queue.length === 0) return;
    const current = queue[index % queue.length];
    const wrong = shuffle(queue.filter((it) => it.id !== current.id)).slice(
      0,
      numOptions - 1
    );
    setOptions(shuffle([...wrong, current]));
    setSelectedOption(null);
    setIsCorrect(null);
  }, [queue, index, numOptions]);

  const currentItem = queue.length > 0 ? queue[index % queue.length] : null;

  const handleAnswer = useCallback(
    (item: QuizItem) => {
      if (selectedOption || !currentItem) return;
      const correct = item.id === currentItem.id;
      setSelectedOption(item);
      setIsCorrect(correct);
      if (correct) setScore((s) => s + 1);
      setTotal((t) => t + 1);
    },
    [selectedOption, currentItem]
  );

  const next = useCallback(() => {
    setIndex((i) => {
      const next = i + 1;
      // Re-shuffle at the end of each pass
      if (next % queue.length === 0) {
        setQueue((q) => shuffle(q));
        return 0;
      }
      return next;
    });
  }, [queue.length]);

  return { currentItem, options, selectedOption, isCorrect, score, total, handleAnswer, next };
}
