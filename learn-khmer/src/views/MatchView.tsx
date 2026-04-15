import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, CircularProgress, Typography, Paper, LinearProgress, Stack, Button, Grid,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';
import { useCharacters } from '../context/CharactersContext';
import { useEnabledSet } from '../store/settingsStore';
import type { KhmerCharacter } from '../data/characters';
import { useAudio } from '../hooks/useAudio';

const ROUND_SIZE = 6;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface AudioSlot {
  char: KhmerCharacter;
  slotIndex: number;
}

const MatchView: React.FC = () => {
  const { characters, loading } = useCharacters();
  const enabledSet = useEnabledSet();
  const { play: play1, isPlaying: isPlaying1, stop: stop1 } = useAudio();
  const { play: play2, isPlaying: isPlaying2, stop: stop2 } = useAudio();

  const items = useMemo(
    () => characters.filter((c) => enabledSet.has(c.id)),
    [characters, enabledSet]
  );

  // Flat shuffled queue and pointer for batching
  const [queue, setQueue] = useState<KhmerCharacter[]>([]);
  const [batchStart, setBatchStart] = useState(0);

  // Per-round state
  const [roundChars, setRoundChars] = useState<KhmerCharacter[]>([]);
  const [audioOrder, setAudioOrder] = useState<AudioSlot[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<{ charId: string; slotIndex: number } | null>(null);
  const [playingSlot, setPlayingSlot] = useState<{ slot: number; voice: 1 | 2 } | null>(null);
  const [roundComplete, setRoundComplete] = useState(false);

  // Score
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  // Initialise queue when items are ready
  useEffect(() => {
    if (items.length > 0) {
      setQueue(shuffle(items));
      setBatchStart(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // Build a round whenever queue or batchStart changes
  const startRound = useCallback((q: KhmerCharacter[], start: number) => {
    if (q.length === 0) return;
    const size = Math.min(ROUND_SIZE, q.length);
    const s = start % q.length;
    let batch: KhmerCharacter[];
    if (s + size <= q.length) {
      batch = q.slice(s, s + size);
    } else {
      batch = [...q.slice(s), ...q.slice(0, size - (q.length - s))];
    }
    setRoundChars(batch);
    setAudioOrder(shuffle(batch).map((char, i) => ({ char, slotIndex: i })));
    setMatched(new Set());
    setSelectedCharId(null);
    setWrongPair(null);
    setRoundComplete(false);
  }, []);

  useEffect(() => {
    startRound(queue, batchStart);
  }, [queue, batchStart, startRound]);

  const nextRound = () => {
    stop1(); stop2();
    const nextStart = batchStart + ROUND_SIZE;
    if (nextStart >= queue.length) {
      const reshuffled = shuffle(items);
      setQueue(reshuffled);
      setBatchStart(0);
    } else {
      setBatchStart(nextStart);
    }
  };

  const handleCharClick = (char: KhmerCharacter) => {
    if (matched.has(char.id) || wrongPair) return;
    setSelectedCharId((prev) => (prev === char.id ? null : char.id));
  };

  const handleAudioPlay = (slot: AudioSlot, voice: 1 | 2, e: React.MouseEvent) => {
    e.stopPropagation();
    if (matched.has(slot.char.id)) return;
    stop1(); stop2();
    if (voice === 1) {
      setPlayingSlot({ slot: slot.slotIndex, voice: 1 });
      play1(slot.char.audioPath);
    } else if (slot.char.audioPath2) {
      setPlayingSlot({ slot: slot.slotIndex, voice: 2 });
      play2(slot.char.audioPath2);
    }
  };

  const handleSlotClick = (slot: AudioSlot) => {
    if (matched.has(slot.char.id) || wrongPair) return;
    // If no char selected, just play voice 1 as a hint
    if (!selectedCharId) {
      stop1(); stop2();
      setPlayingSlot({ slot: slot.slotIndex, voice: 1 });
      play1(slot.char.audioPath);
      return;
    }
    const correct = slot.char.id === selectedCharId;
    if (correct) {
      const next = new Set(matched).add(selectedCharId);
      setMatched(next);
      setSelectedCharId(null);
      setTotal((t) => t + 1);
      setScore((s) => s + 1);
      if (next.size === roundChars.length) {
        setTimeout(() => setRoundComplete(true), 400);
      }
    } else {
      const snap = selectedCharId;
      const snapSlot = slot.slotIndex;
      setWrongPair({ charId: snap, slotIndex: snapSlot });
      setTotal((t) => t + 1);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedCharId(null);
      }, 800);
    }
  };

  // Clear playingSlot when audio ends
  useEffect(() => {
    if (!isPlaying1 && !isPlaying2) setPlayingSlot(null);
  }, [isPlaying1, isPlaying2]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (items.length < 2)
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Enable at least 2 characters in Settings to use this quiz.</Typography>
      </Box>
    );

  const getCharBorderColor = (char: KhmerCharacter) => {
    if (matched.has(char.id)) return 'success.main';
    if (wrongPair?.charId === char.id) return 'error.main';
    if (selectedCharId === char.id) return 'primary.main';
    return 'divider';
  };

  const getCharBgColor = (char: KhmerCharacter) => {
    if (matched.has(char.id)) return 'success.light';
    if (wrongPair?.charId === char.id) return 'error.light';
    if (selectedCharId === char.id) return 'primary.light';
    return 'background.paper';
  };

  const getSlotBorderColor = (slot: AudioSlot) => {
    if (matched.has(slot.char.id)) return 'success.main';
    if (wrongPair?.slotIndex === slot.slotIndex) return 'error.main';
    return 'divider';
  };

  const getSlotBgColor = (slot: AudioSlot) => {
    if (matched.has(slot.char.id)) return 'success.light';
    if (wrongPair?.slotIndex === slot.slotIndex) return 'error.light';
    return 'background.paper';
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Match
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

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select a character, then click the audio you think matches it.
      </Typography>

      <Grid container spacing={2}>
        {/* Left: character cards */}
        <Grid size={{ xs: 6 }}>
          <Stack spacing={1.5}>
            {roundChars.map((char) => (
              <Paper
                key={char.id}
                elevation={selectedCharId === char.id ? 4 : 1}
                onClick={() => handleCharClick(char)}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: matched.has(char.id) ? 'default' : 'pointer',
                  border: '2px solid',
                  borderColor: getCharBorderColor(char),
                  bgcolor: getCharBgColor(char),
                  opacity: matched.has(char.id) ? 0.6 : 1,
                  transition: 'border-color 0.2s, background-color 0.2s',
                  '&:hover': !matched.has(char.id) ? { borderColor: 'primary.light' } : {},
                  height: 88,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h3" sx={{ lineHeight: 1 }}>{char.character}</Typography>
              </Paper>
            ))}
          </Stack>
        </Grid>

        {/* Right: audio slots */}
        <Grid size={{ xs: 6 }}>
          <Stack spacing={1.5}>
            {audioOrder.map((slot) => (
              <Paper
                key={slot.slotIndex}
                elevation={1}
                onClick={() => handleSlotClick(slot)}
                sx={{
                  p: 2,
                  border: '2px solid',
                  borderColor: getSlotBorderColor(slot),
                  bgcolor: getSlotBgColor(slot),
                  opacity: matched.has(slot.char.id) ? 0.6 : 1,
                  transition: 'border-color 0.2s, background-color 0.2s',
                  cursor: matched.has(slot.char.id) ? 'default' : 'pointer',
                  '&:hover': !matched.has(slot.char.id) ? { borderColor: selectedCharId ? 'success.light' : 'primary.light' } : {},
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  height: 88,
                }}
              >
                {/* Voice 1 */}
                <Box
                  component="span"
                  onClick={(e) => handleAudioPlay(slot, 1, e)}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    cursor: matched.has(slot.char.id) ? 'default' : 'pointer',
                    '&:hover': !matched.has(slot.char.id) ? { bgcolor: 'primary.dark' } : {},
                    flexShrink: 0,
                  }}
                >
                  {playingSlot?.slot === slot.slotIndex && playingSlot.voice === 1
                    ? <StopIcon />
                    : <VolumeUpIcon />}
                </Box>

                {/* Voice 2 */}
                {audioOrder[0]?.char.audioPath2 && (
                  <Box
                    component="span"
                    onClick={(e) => handleAudioPlay(slot, 2, e)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                      color: 'white',
                      cursor: matched.has(slot.char.id) ? 'default' : 'pointer',
                      '&:hover': !matched.has(slot.char.id) ? { bgcolor: 'secondary.dark' } : {},
                      flexShrink: 0,
                    }}
                  >
                    {playingSlot?.slot === slot.slotIndex && playingSlot.voice === 2
                      ? <StopIcon />
                      : <VolumeUpIcon />}
                  </Box>
                )}

                {/* Reveal character after match */}
                {matched.has(slot.char.id) && (
                  <Typography variant="h4" sx={{ lineHeight: 1 }}>
                    {slot.char.character}
                  </Typography>
                )}
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>

      {roundComplete && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" fontWeight={700} color="success.main" sx={{ mb: 2 }}>
            Round complete!
          </Typography>
          <Button variant="contained" onClick={nextRound} size="large">
            Next Round
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MatchView;
