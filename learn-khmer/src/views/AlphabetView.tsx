import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { KhmerCharacter } from '../data/characters';
import { useCharacters } from '../context/CharactersContext';
import AlphabetGrid from '../components/AlphabetGrid';
import { useAudio } from '../hooks/useAudio';

const AlphabetView: React.FC = () => {
  const { characters, loading } = useCharacters();
  const { isPlaying, play } = useAudio();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlay = (char: KhmerCharacter) => {
    setPlayingId(char.id);
    play(char.audioPath);
  };

  // Clear playingId when audio stops
  useEffect(() => {
    if (!isPlaying) setPlayingId(null);
  }, [isPlaying]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Khmer Alphabet
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Tap the speaker icon to hear each character's pronunciation.
      </Typography>
      <AlphabetGrid
        characters={characters}
        onPlay={handlePlay}
        playingId={playingId}
      />
    </Box>
  );
};

export default AlphabetView;
