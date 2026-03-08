import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Typography, Box, Grid, Paper } from '@mui/material';

// Define the type for a pair
interface Pair {
  khmer: string;
  thai: string;
}

// Load the pairs from the CSV file (mocked here for now)
const pairs: Pair[] = [
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
  { khmer: 'អ', thai: 'อ' },
];

const QuizApp: React.FC = () => {
  const [currentPair, setCurrentPair] = useState<Pair | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
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
    setFeedback('');
  }, []);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (currentPair && answer === `${currentPair.khmer} / ${currentPair.thai}`) {
        setScore((prev) => prev + 1);
        setFeedback('Correct!');
      } else {
        setFeedback('Incorrect.');
      }
      setTimeout(loadNewQuestion, 1000);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, fontFamily: 'Arial, sans-serif' }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center', width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Khmer-Thai Alphabet Quiz
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Listen to the audio and select the correct pair
        </Typography>
      </Paper>

      {currentPair && (
        <Box sx={{ mt: 3, width: '100%', maxWidth: 500 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Button variant="contained" onClick={() => playAudio('khmer')}>
              Khmer {isPlaying === 'khmer' ? '🔊' : '🎵'}
            </Button>
            <Button variant="contained" onClick={() => playAudio('thai')}>
              Thai {isPlaying === 'thai' ? '🔊' : '🎵'}
            </Button>
          </Box>
          <Grid container spacing={2}>
            {options.map((option) => (
              <Grid size={6} key={option}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {feedback && (
        <Typography variant="body1" color={feedback === 'Correct!' ? 'success.main' : 'error.main'} sx={{ mt: 2 }}>
          {feedback}
        </Typography>
      )}

      <Typography variant="body1" sx={{ mt: 3 }}>
        Score: {score}
      </Typography>
    </Box>
  );
};

export default QuizApp;