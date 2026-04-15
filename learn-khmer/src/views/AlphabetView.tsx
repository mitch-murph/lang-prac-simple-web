import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { KhmerCharacter } from '../data/characters';
import { useCharacters } from '../context/CharactersContext';
import AlphabetGrid from '../components/AlphabetGrid';
import { useAudio } from '../hooks/useAudio';

const AlphabetView: React.FC = () => {
  const { characters, loading } = useCharacters();
  const { isPlaying: isPlaying1, play: play1 } = useAudio();
  const { isPlaying: isPlaying2, play: play2 } = useAudio();
  const [playingId1, setPlayingId1] = useState<string | null>(null);
  const [playingId2, setPlayingId2] = useState<string | null>(null);

  const handlePlay1 = (char: KhmerCharacter) => {
    setPlayingId1(char.id);
    play1(char.audioPath);
  };

  const handlePlay2 = (char: KhmerCharacter) => {
    if (!char.audioPath2) return;
    setPlayingId2(char.id);
    play2(char.audioPath2);
  };

  // Clear playingIds when audio stops
  useEffect(() => { if (!isPlaying1) setPlayingId1(null); }, [isPlaying1]);
  useEffect(() => { if (!isPlaying2) setPlayingId2(null); }, [isPlaying2]);

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
        onPlay={handlePlay1}
        playingId={playingId1}
        onPlay2={handlePlay2}
        playingId2={playingId2}
      />
    </Box>
  );
};

export default AlphabetView;
