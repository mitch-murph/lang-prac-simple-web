import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import QuizApp from './QuizApp';
import { quizTypes } from './quizConfigs.ts';

const App: React.FC = () => {
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);

  // If no quiz selected, show selector
  if (selectedQuizIndex === null) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Select a Quiz Type
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            {quizTypes.map((quizType, index) => (
              <Button
                key={quizType.id}
                variant="contained"
                size="large"
                onClick={() => setSelectedQuizIndex(index)}
              >
                {quizType.name}
              </Button>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  }

  // Render selected quiz
  const selectedQuiz = quizTypes[selectedQuizIndex];
  return (
    <Box>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setSelectedQuizIndex(null)}
        >
          ← Back to Quiz Selection
        </Button>
      </Box>
      <QuizApp key={selectedQuizIndex} content={selectedQuiz.content} />
    </Box>
  );
};

export default App;
