import React from 'react';
import { Button, Typography, Box, Grid, Paper } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import type { QuizContent } from './QuizApp';
import BaseQuiz from './BaseQuiz';

interface CharacterToSoundQuizProps {
  content: QuizContent;
}

const CharacterToSoundQuiz: React.FC<CharacterToSoundQuizProps> = ({ content }) => (
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
            <Box sx={{ mb: 3, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
              <Typography variant="h2" sx={{ fontSize: 64 }}>
                {content.fields.map((field) => currentItem[field.name]).join(' ')}
              </Typography>
            </Box>
          )}

          <Grid container spacing={2}>
            {options.map((option) => {
              const isCorrect = currentItem && currentItem.id === option.id;
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
                    sx={{ bgcolor: bg, color, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 2 }}
                    disabled={!!selectedOption}
                  >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {content.fields.map((field) => (
                        field.audioPathTemplate && (
                          <Button
                            key={field.name}
                            size="medium"
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              playAudio(field.name + '-' + option.id, option);
                            }}
                            startIcon={isPlaying === field.name + '-' + option.id ? <Pause /> : <PlayArrow />}
                            sx={{ minWidth: 100 }}
                          >
                            {field.label}
                          </Button>
                        )
                      ))}
                    </Box>
                  </Button>
                </Grid>
              );
            })}
          </Grid>

          <Typography variant="body1" sx={{ mt: 3 }}>
            Score: {score}
          </Typography>
        </Paper>
      </Box>
    )}
  </BaseQuiz>
);

export default CharacterToSoundQuiz;
