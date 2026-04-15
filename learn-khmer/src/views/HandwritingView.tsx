import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  Box, CircularProgress, Typography, Button, Stack, LinearProgress
} from '@mui/material';
import { useCharacters } from '../context/CharactersContext';
import { useAudio } from '../hooks/useAudio';
import { useEnabledSet } from '../store/settingsStore';
import HandwritingPad from '../components/HandwritingPad';
import type { HandwritingPadHandle } from '../components/HandwritingPad';
import AudioButton from '../components/AudioButton';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const HandwritingView: React.FC = () => {
  const { characters, loading } = useCharacters();
  const [queue, setQueue] = useState(() => shuffle(characters));
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const enabledSet = useEnabledSet();
  const { play: play1, isPlaying: isPlaying1, stop: stop1 } = useAudio();
  const { play: play2, isPlaying: isPlaying2, stop: stop2 } = useAudio();
  const padRef = useRef<HandwritingPadHandle>(null);

  const items = useMemo(
    () => characters.filter((c) => enabledSet.has(c.id)),
    [characters, enabledSet]
  );

  useEffect(() => {
    if (items.length > 0) {
      setQueue(shuffle(items));
      setIndex(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const currentItem = queue[index] ?? null;

  // Auto-play audio (voice 1) when question changes
  useEffect(() => {
    if (currentItem) {
      const t = setTimeout(() => play1(currentItem.audioPath), 300);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem?.id]);

  const handleReveal = () => setShowAnswer(true);

  const handleSelf = useCallback(
    (correct: boolean) => {
      if (correct) setScore((s) => s + 1);
      setTotal((t) => t + 1);
      setShowAnswer(false);
      padRef.current?.clear();
      setIndex((i) => {
        const next = i + 1;
        if (next >= queue.length) {
          setQueue(shuffle(items));
          return 0;
        }
        return next;
      });
    },
    [queue.length, items]
  );

  const handleReplay1 = () => {
    if (isPlaying1) {
      stop1();
    } else if (currentItem) {
      play1(currentItem.audioPath);
    }
  };

  const handleReplay2 = () => {
    if (isPlaying2) {
      stop2();
    } else if (currentItem?.audioPath2) {
      play2(currentItem.audioPath2);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (items.length === 0)
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Enable characters in Settings to use this quiz.</Typography>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', py: 4, px: 2, textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Handwriting Practice
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Score: {score} / {total}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={total > 0 ? (score / total) * 100 : 0}
          sx={{ flex: 1, height: 8, borderRadius: 4 }}
        />
      </Stack>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Listen to the sound and write the character in the box below.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
        <AudioButton isPlaying={isPlaying1} onPlay={handleReplay1} size="large" />
        {currentItem?.audioPath2 && (
          <AudioButton isPlaying={isPlaying2} onPlay={handleReplay2} size="large" />
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <HandwritingPad
          ref={padRef}
          showAnswer={showAnswer}
          answerCharacter={currentItem?.character ?? ''}
          onClear={() => {}}
        />
      </Box>

      {!showAnswer ? (
        <Button variant="outlined" onClick={handleReveal} sx={{ mr: 1 }}>
          Reveal Answer
        </Button>
      ) : (
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="success" onClick={() => handleSelf(true)}>
            ✓ Got it
          </Button>
          <Button variant="contained" color="error" onClick={() => handleSelf(false)}>
            ✗ Missed it
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default HandwritingView;
