import React from 'react';
import { Button, Typography, Box, Grid, Paper } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import type { QuizContent } from './QuizApp';
import BaseQuiz from './BaseQuiz';

interface SoundToCharacterQuizProps {
  content: QuizContent;
}

const SoundToCharacterQuiz: React.FC<SoundToCharacterQuizProps> = ({ content }) => (
  <BaseQuiz content={content}>
    {({ currentItem, options, selectedOption, score, isPlaying, handleAnswer, playAudio }) => (
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {content.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {content.subtitle}
          </Typography>

          {currentItem && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                {content.fields.map((field) => (
                  <Button
                    key={field.name}
                    variant="contained"
                    onClick={() => playAudio(field.name)}
                    sx={{ minWidth: 120 }}
                    startIcon={isPlaying === field.name ? <Pause /> : <PlayArrow />}
                    aria-label={`Play ${field.label} audio`}
                    disabled={!field.audioPathTemplate}
                  >
                    {field.label}
                  </Button>
                ))}
              </Box>

              <Grid container spacing={2}>
                {options.map((option) => {
                  const isCorrect = currentItem.id === option.id;
                  const isSelected = selectedOption && selectedOption.id === option.id;
                  let bg: any = undefined;
                  let color: any = undefined;
                  if (selectedOption) {
                    if (isCorrect) {
                      bg = 'success.main';
                      color = 'common.white';
                    } else if (isSelected) {
                      bg = 'error.main';
                      color = 'common.white';
                    }
                  }
                  return (
                    <Grid size={6} key={option.id}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleAnswer(option)}
                        sx={{ fontSize: 32, bgcolor: bg, color, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        disabled={!!selectedOption}
                      >
                        {content.title === 'Vietnamese: Audio → English' ? (
                          <span>{option.english}</span>
                        ) : (
                          content.fields.map((field) => (
                            <span key={field.name}>{option[field.name]}</span>
                          ))
                        )}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          <Typography variant="body1" sx={{ mt: 3 }}>
            Score: {score}
          </Typography>
        </Paper>
      </Box>
    )}
  </BaseQuiz>
);

export default SoundToCharacterQuiz;
