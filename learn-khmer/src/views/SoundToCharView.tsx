import React, { useEffect, useRef, useMemo } from 'react';
import {
  Box, CircularProgress, Typography, Grid, Button, LinearProgress, Stack
} from '@mui/material';
import type { KhmerCharacter } from '../data/characters';
import { useCharacters } from '../context/CharactersContext';
import { useQuiz } from '../hooks/useQuiz';
import { useAudio } from '../hooks/useAudio';
import { useEnabledSet } from '../store/settingsStore';
import CharacterCard from '../components/CharacterCard';
import AudioButton from '../components/AudioButton';

const SoundToCharView: React.FC = () => {
  const { characters, loading } = useCharacters();
  const enabledSet = useEnabledSet();
  const { play: play1, isPlaying: isPlaying1, stop: stop1 } = useAudio();
  const { play: play2, isPlaying: isPlaying2, stop: stop2 } = useAudio();
  const autoPlayed = useRef(false);

  const items = useMemo(
    () => characters.filter((c) => enabledSet.has(c.id)),
    [characters, enabledSet]
  );
  const { currentItem, options, selectedOption, isCorrect, score, total, handleAnswer, next } =
    useQuiz({ items });

  // Auto-play voice 1 when question changes
  useEffect(() => {
    if (!currentItem) return;
    autoPlayed.current = false;
    const t = setTimeout(() => {
      stop1();
      stop2();
      play1(currentItem.audioPath);
      autoPlayed.current = true;
    }, 200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem?.id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (items.length < 4)
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Enable at least 4 characters in Settings to use this quiz.</Typography>
      </Box>
    );

  const getHighlight = (opt: KhmerCharacter): 'correct' | 'wrong' | 'none' => {
    if (!selectedOption) return 'none';
    if (opt.id === currentItem?.id) return 'correct';
    if (opt.id === selectedOption.id) return 'wrong';
    return 'none';
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Sound → Character
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

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Which character matches this sound?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
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
      </Box>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        {options.map((opt) => (
          <Grid key={opt.id} size={{ xs: 6, sm: 3 }}>
            <CharacterCard
              character={opt}
              highlight={getHighlight(opt)}
              onClick={selectedOption ? undefined : () => handleAnswer(opt)}
              disabled={!!selectedOption}
            />
          </Grid>
        ))}
      </Grid>

      {selectedOption && (
        <Box textAlign="center">
          <Typography
            variant="h6"
            fontWeight={700}
            color={isCorrect ? 'success.main' : 'error.main'}
            sx={{ mb: 2 }}
          >
            {isCorrect ? '✓ Correct!' : `✗ It was ${currentItem?.character}`}
          </Typography>
          <Button variant="contained" onClick={next}>
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SoundToCharView;
