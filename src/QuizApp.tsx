import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Typography, Box, Grid, Paper } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';

// Generic quiz types
export interface QuizItem {
  id: string;
  [fieldName: string]: string; // field values, e.g., khmer: 'áž€', thai: 'à¸'
}

export interface QuizField {
  name: string; // field name, e.g., 'khmer'
  label: string; // display label for audio button, e.g., 'Khmer'
  audioPathTemplate?: (value: string) => string; // e.g., (val) => `data/khmer-alphabet/${val}.mp3`
}

export interface QuizContent {
  title: string;
  subtitle: string;
  items: QuizItem[];
  fields: QuizField[];
  mode: 'sound-to-character' | 'character-to-sound'; // How to present the quiz
}

// Factory helper to create QuizContent from simple mappings
export function createQuizContent(config: {
  title: string;
  subtitle: string;
  mode: 'sound-to-character' | 'character-to-sound';
  fields: Array<{
    name: string;
    label: string;
    audioPathTemplate?: (value: string) => string;
  }>;
  mappings: Array<Record<string, string>>;
}): QuizContent {
  const items: QuizItem[] = config.mappings.map((mapping, index) => ({
    id: `item-${index}`,
    ...mapping,
  }));

  return {
    title: config.title,
    subtitle: config.subtitle,
    items,
    fields: config.fields,
    mode: config.mode,
  };
}

interface QuizAppProps {
  content: QuizContent;
}

const QuizApp: React.FC<QuizAppProps> = ({ content }) => {
  const [currentItem, setCurrentItem] = useState<QuizItem | null>(null);
  const [options, setOptions] = useState<QuizItem[]>([]);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuizItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Utility function to shuffle and load a new question
  const loadNewQuestion = useCallback(() => {
    const randomItem = content.items[Math.floor(Math.random() * content.items.length)];
    setCurrentItem(randomItem);

    // Generate options (correct + random wrong answers)
    const wrongAnswers = content.items
      .filter((item) => item.id !== randomItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = [...wrongAnswers, randomItem].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedOption(null);
  }, [content]);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  const isSameItem = (a: QuizItem | null | undefined, b: QuizItem | null | undefined) =>
    !!a && !!b && a.id === b.id;

  const handleAnswer = useCallback(
    (answer: QuizItem) => {
      if (!currentItem) return;

      setSelectedOption(answer);

      if (isSameItem(answer, currentItem)) {
        setScore((prev) => prev + 1);
      }

      setTimeout(() => {
        loadNewQuestion();
      }, 1000);
    },
    [currentItem, loadNewQuestion]
  );

  const playAudio = useCallback(
    (identifier: string, targetItem?: QuizItem) => {
      if (isPlaying === identifier) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setIsPlaying(null);
        return;
      }

      // Parse identifier: could be just 'fieldName' or 'fieldName-itemId'
      const fieldName = identifier.includes('-') ? identifier.split('-')[0] : identifier;
      const itemToPlay = targetItem || currentItem;

      if (itemToPlay) {
        const field = content.fields.find((f) => f.name === fieldName);
        if (field && field.audioPathTemplate) {
          const audioPath = field.audioPathTemplate(itemToPlay[fieldName]);
          const audio = new Audio(audioPath);
          audioRef.current = audio;
          audio.play();
          setIsPlaying(identifier);

          audio.onended = () => {
            setIsPlaying(null);
            audioRef.current = null;
          };
        }
      }
    },
    [currentItem, isPlaying, content]
  );

  return (
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
            {content.mode === 'sound-to-character' ? (
              <>
                {/* Sound-to-Character: Audio buttons at top, character options below */}
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
                    const isCorrect = isSameItem(currentItem, option);
                    const isSelected = isSameItem(selectedOption, option);
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
                          sx={{
                            fontSize: 32,
                            bgcolor: bg,
                            color,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                          disabled={!!selectedOption}
                        >
                          {content.fields.map((field) => (
                            <span key={field.name}>{option[field.name]}</span>
                          ))}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            ) : (
              <>
                {/* Character-to-Sound: Show character as question, audio buttons as answers */}
                <Box sx={{ mb: 3, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
                  <Typography variant="h2" sx={{ fontSize: 64 }}>
                    {content.fields.map((field) => currentItem[field.name]).join(' ')}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {options.map((option) => {
                    const isCorrect = isSameItem(currentItem, option);
                    const isSelected = isSameItem(selectedOption, option);
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
                          sx={{
                            bgcolor: bg,
                            color,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            py: 2,
                          }}
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
              </>
            )}
          </Box>
        )}


        <Typography variant="body1" sx={{ mt: 3 }}>
          Score: {score}
        </Typography>
      </Paper>
    </Box>
  );
};

export default QuizApp;
