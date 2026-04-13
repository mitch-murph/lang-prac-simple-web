import { useState, useCallback, useRef } from 'react';

export interface UseAudioReturn {
  isPlaying: boolean;
  play: (src: string) => void;
  stop: () => void;
}

export function useAudio(): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(
    (src: string) => {
      stop();
      const audio = new Audio(src);
      audioRef.current = audio;
      setIsPlaying(true);
      audio.play().catch(() => setIsPlaying(false));
      audio.onended = () => {
        audioRef.current = null;
        setIsPlaying(false);
      };
    },
    [stop]
  );

  return { isPlaying, play, stop };
}
