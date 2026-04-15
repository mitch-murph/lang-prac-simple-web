import React, { useEffect, useMemo } from 'react';
import {
  Box, CircularProgress, Typography, Grid, Button, LinearProgress, Stack, Paper
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';
import type { KhmerCharacter } from '../data/characters';
import { useCharacters } from '../context/CharactersContext';
import { useQuiz } from '../hooks/useQuiz';
import { useAudio } from '../hooks/useAudio';
import { useEnabledSet } from '../store/settingsStore';

const CharToSoundView: React.FC = () => {
  const { characters, loading } = useCharacters();
  const enabledSet = useEnabledSet();
  const { play: play1, stop: stop1 } = useAudio();
  const { play: play2, stop: stop2 } = useAudio();
  // Track which option id is currently playing so each button shows its own state
  const [playingId1, setPlayingId1] = React.useState<string | null>(null);
  const [playingId2, setPlayingId2] = React.useState<string | null>(null);

  const items = useMemo(
    () => characters.filter((c) => enabledSet.has(c.id)),
    [characters, enabledSet]
  );
  const { currentItem, options, selectedOption, isCorrect, score, total, handleAnswer, next } =
    useQuiz({ items });

  // Stop audio and clear playingIds when moving to new question
  useEffect(() => {
    stop1();
    stop2();
    setPlayingId1(null);
    setPlayingId2(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem?.id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (items.length < 4)
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Enable at least 4 characters in Settings to use this quiz.</Typography>
      </Box>
    );

  const getHighlightColor = (opt: KhmerCharacter) => {
    if (!selectedOption) return 'divider';
    if (opt.id === currentItem?.id) return 'success.main';
    if (opt.id === selectedOption.id) return 'error.main';
    return 'divider';
  };

  const handlePlay1 = (opt: KhmerCharacter) => {
    if (playingId1 === opt.id) {
      stop1();
      setPlayingId1(null);
    } else {
      setPlayingId1(opt.id);
      play1(opt.audioPath);
    }
  };

  const handlePlay2 = (opt: KhmerCharacter) => {
    if (!opt.audioPath2) return;
    if (playingId2 === opt.id) {
      stop2();
      setPlayingId2(null);
    } else {
      setPlayingId2(opt.id);
      play2(opt.audioPath2);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Character → Sound
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

      {currentItem && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography sx={{ fontSize: '5rem', lineHeight: 1.1, mb: 1 }}>
            {currentItem.character}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Play each sound and pick the one that matches.
          </Typography>
        </Box>
      )}

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        {options.map((opt, i) => (
          <Grid key={opt.id} size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={2}
              onClick={selectedOption ? undefined : () => handleAnswer(opt)}
              sx={{
                border: '2px solid',
                borderColor: getHighlightColor(opt),
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                cursor: selectedOption ? 'default' : 'pointer',
                transition: 'border-color 0.2s, transform 0.1s',
                '&:hover': !selectedOption ? { transform: 'scale(1.04)', borderColor: 'primary.light' } : {},
                opacity: selectedOption && opt.id !== currentItem?.id && opt.id !== selectedOption.id ? 0.5 : 1,
              }}
            >
              {/* Audio play buttons — stopPropagation so clicking doesn't also submit answer */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                <Box
                  component="span"
                  onClick={(e) => { e.stopPropagation(); handlePlay1(opt); }}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  {playingId1 === opt.id ? <StopIcon /> : <VolumeUpIcon />}
                </Box>
                {opt.audioPath2 && (
                  <Box
                    component="span"
                    onClick={(e) => { e.stopPropagation(); handlePlay2(opt); }}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                      color: 'white',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'secondary.dark' },
                    }}
                  >
                    {playingId2 === opt.id ? <StopIcon /> : <VolumeUpIcon />}
                  </Box>
                )}
              </Box>

              {/* Before answering: show option number. After: reveal character */}
              {selectedOption ? (
                <Typography variant="h4" sx={{ lineHeight: 1 }}>
                  {opt.character}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Option {i + 1}
                </Typography>
              )}
            </Paper>
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

export default CharToSoundView;
