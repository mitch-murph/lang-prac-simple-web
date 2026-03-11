import React from "react";
import { Box, Typography, Paper, Button, Divider } from '@mui/material';

interface AlphabetDisplayProps {
  title: string;
  letters: Array<{ character: string; sound?: string }>;
}

const getAudioPath = (title: string, character: string) => {
  if (title.toLowerCase().includes('khmer')) {
    return `data/khmer-alphabet/${character}.mp3`;
  } else if (title.toLowerCase().includes('thai')) {
    return `data/thai-alphabet/${character}.mp3`;
  }
  return '';
};

const AlphabetDisplay: React.FC<AlphabetDisplayProps> = ({ title, letters }) => {
  const playAudio = (audioPath: string) => {
    const audio = new Audio(audioPath);
    audio.play();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {letters.map((letter, idx) => (
          <Paper
            key={idx}
            elevation={3}
            sx={{
              minWidth: 80,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4">{letter.character}</Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => playAudio(getAudioPath(title, letter.character))}
            >
              Play Audio
            </Button>
            {letter.sound && (
              <Typography variant="body2" color="text.secondary">{letter.sound}</Typography>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default AlphabetDisplay;
