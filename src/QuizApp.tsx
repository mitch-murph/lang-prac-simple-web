import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Typography, Box, Grid, Paper } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';

// Define the type for a pair
interface Pair {
  khmer: string;
  thai: string;
}

// Load the pairs from the CSV file (mocked here for now)
const pairs: { khmer: string; thai: string }[] = [
  { khmer: 'ក', thai: 'ก' },
  { khmer: 'ខ', thai: 'ข' },
  { khmer: 'ង', thai: 'ง' },
  { khmer: 'ច', thai: 'จ' },
  { khmer: 'ញ', thai: 'ญ' },
  { khmer: 'ដ', thai: 'ด' },
  { khmer: 'ត', thai: 'ต' },
  { khmer: 'ថ', thai: 'ถ' },
  { khmer: 'ន', thai: 'น' },
  { khmer: 'ប', thai: 'บ' },
  { khmer: 'ព', thai: 'ป' },
  { khmer: 'ផ', thai: 'พ' },
  { khmer: 'ម', thai: 'ม' },
  { khmer: 'យ', thai: 'ย' },
  { khmer: 'រ', thai: 'ร' },
  { khmer: 'ល', thai: 'ล' },
  { khmer: 'វ', thai: 'ว' },
  { khmer: 'ស', thai: 'ส' },
  { khmer: 'ហ', thai: 'ห' },
  { khmer: 'អ', thai: 'อ' }
];

const QuizApp: React.FC = () => {
  const [currentPair, setCurrentPair] = useState<Pair | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<'khmer' | 'thai' | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Utility function to shuffle and load a new question
  const loadNewQuestion = useCallback(() => {
    const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
    setCurrentPair(randomPair);

    // Generate options (correct + random wrong answers)
    const wrongAnswers = pairs
      .filter((pair) => pair.thai !== randomPair.thai)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((pair) => `${pair.khmer} / ${pair.thai}`);

    const correctOption = `${randomPair.khmer} / ${randomPair.thai}`;
    const allOptions = [...wrongAnswers, correctOption].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedOption(null);
  }, []);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (!currentPair) return;

      setSelectedOption(answer);

      if (answer === `${currentPair.khmer} / ${currentPair.thai}`) {
        setScore((prev) => prev + 1);
      }

      setTimeout(() => {
        loadNewQuestion();
      }, 1000);
    },
    [currentPair, loadNewQuestion]
  );

  const playAudio = useCallback(
    (language: 'khmer' | 'thai') => {
      if (isPlaying === language) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setIsPlaying(null);
        return;
      }

      if (currentPair) {
        const audio = new Audio(
          `data/${language}-alphabet/${language === 'khmer' ? currentPair.khmer : currentPair.thai}.mp3`
        );
        audioRef.current = audio;
        audio.play();
        setIsPlaying(language);

        audio.onended = () => {
          setIsPlaying(null);
          audioRef.current = null;
        };
      }
    },
    [currentPair, isPlaying]
  );

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Khmer-Thai Alphabet Quiz
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Listen to the audio and select the correct pair
        </Typography>

        {currentPair && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => playAudio('khmer')}
                sx={{ minWidth: 120 }}
                startIcon={isPlaying === 'khmer' ? <Pause /> : <PlayArrow />}
                aria-label="Play Khmer audio"
              >
                Khmer
              </Button>
              <Button
                variant="contained"
                onClick={() => playAudio('thai')}
                sx={{ minWidth: 120 }}
                startIcon={isPlaying === 'thai' ? <Pause /> : <PlayArrow />}
                aria-label="Play Thai audio"
              >
                Thai
              </Button>
            </Box>

            <Grid container spacing={2}>
              {options.map((option) => {
                const correctOption = currentPair ? `${currentPair.khmer} / ${currentPair.thai}` : null;
                const isCorrect = correctOption === option;
                const isSelected = selectedOption === option;
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
                  <Grid size={6} key={option}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleAnswer(option)}
                      sx={{ fontSize: 32, bgcolor: bg, color }}
                      disabled={!!selectedOption}
                    >
                      {option}
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
  );
};

export default QuizApp;