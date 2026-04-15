import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Button, CircularProgress, LinearProgress, Stack, Typography,
} from '@mui/material';
import { useCharacters } from '../context/CharactersContext';
import { useEnabledSet } from '../store/settingsStore';
import { useAudio } from '../hooks/useAudio';
import AudioButton from '../components/AudioButton';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const FlashcardsView: React.FC = () => {
  const { characters, loading } = useCharacters();
  const enabledSet = useEnabledSet();
  const { play: play1, isPlaying: isPlaying1 } = useAudio();
  const { play: play2, isPlaying: isPlaying2 } = useAudio();

  const items = useMemo(
    () => characters.filter((c) => enabledSet.has(c.id)),
    [characters, enabledSet]
  );

  const [queue, setQueue] = useState(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (items.length > 0) {
      setQueue(shuffle(items));
      setIndex(0);
      setRevealed(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const currentItem = queue[index] ?? null;

  const advance = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setTotal((t) => t + 1);
    setRevealed(false);
    setIndex((i) => {
      const next = i + 1;
      if (next >= queue.length) {
        setQueue(shuffle(items));
        return 0;
      }
      return next;
    });
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
        Flashcards
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

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Look at the character, mentally recall the sound, then reveal.
      </Typography>

      {/* Character display */}
      <Box
        sx={{
          fontSize: '8rem',
          lineHeight: 1.1,
          mb: 4,
          minHeight: 140,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {currentItem?.character}
      </Box>

      {!revealed ? (
        <Button variant="contained" size="large" onClick={() => setRevealed(true)} sx={{ minWidth: 160 }}>
          Reveal
        </Button>
      ) : (
        <Box>
          {currentItem?.romanization && (
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {currentItem.romanization}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            <AudioButton
              isPlaying={isPlaying1}
              onPlay={() => currentItem && play1(currentItem.audioPath)}
              size="large"
            />
            {currentItem?.audioPath2 && (
              <AudioButton
                isPlaying={isPlaying2}
                onPlay={() => currentItem.audioPath2 && play2(currentItem.audioPath2)}
                size="large"
              />
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() => advance(false)}
              sx={{ minWidth: 130 }}
            >
              ✗ Missed it
            </Button>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => advance(true)}
              sx={{ minWidth: 130 }}
            >
              ✓ Got it
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default FlashcardsView;
