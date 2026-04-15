import React from 'react';
import { Box, Button, Typography, Stack, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HearingIcon from '@mui/icons-material/Hearing';
import AbcIcon from '@mui/icons-material/Abc';
import EditIcon from '@mui/icons-material/Edit';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import StyleIcon from '@mui/icons-material/Style';

const MODES = [
  {
    label: 'Browse Alphabet',
    description: 'View all characters and play their sounds',
    icon: <MenuBookIcon fontSize="large" />,
    path: '/alphabet',
    color: '#1565c0',
  },
  {
    label: 'Sound → Character',
    description: 'Hear a sound and pick the matching character',
    icon: <HearingIcon fontSize="large" />,
    path: '/quiz/sound-to-char',
    color: '#6a1b9a',
  },
  {
    label: 'Character → Sound',
    description: 'See a character and identify which sound it makes',
    icon: <AbcIcon fontSize="large" />,
    path: '/quiz/char-to-sound',
    color: '#00695c',
  },
  {
    label: 'Handwriting',
    description: 'Hear a sound and practice writing the character',
    icon: <EditIcon fontSize="large" />,
    path: '/quiz/handwriting',
    color: '#b8180d',
  },
  {
    label: 'Match',
    description: 'Match characters to their sounds side by side',
    icon: <CompareArrowsIcon fontSize="large" />,
    path: '/quiz/match',
    color: '#e65100',
  },
  {
    label: 'Flashcards',
    description: 'See a character, recall the sound, then reveal to check',
    icon: <StyleIcon fontSize="large" />,
    path: '/quiz/flashcards',
    color: '#4527a0',
  },
];

const HomeView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 6, px: 2 }}>
      <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
        🇰🇭 Learn Khmer
      </Typography>
      <Typography variant="subtitle1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        Alphabet quiz and handwriting practice
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Stack spacing={2}>
        {MODES.map((mode) => (
          <Paper
            key={mode.path}
            elevation={2}
            sx={{
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'border-color 0.15s, transform 0.1s',
              '&:hover': { borderColor: mode.color, transform: 'translateX(4px)' },
            }}
            onClick={() => navigate(mode.path)}
          >
            <Button
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                px: 3,
                py: 2,
                textTransform: 'none',
                gap: 2,
                color: mode.color,
              }}
            >
              {mode.icon}
              <Box textAlign="left">
                <Typography variant="h6" fontWeight={600}>
                  {mode.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mode.description}
                </Typography>
              </Box>
            </Button>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default HomeView;
