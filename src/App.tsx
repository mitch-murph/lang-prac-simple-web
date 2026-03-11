import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Divider, CircularProgress } from '@mui/material';
import QuizApp from './QuizApp';
import type { QuizContent } from './QuizApp';
import { quizCategories } from './quizConfigs.ts';

const App: React.FC = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<{ categoryIndex: number; quizIndex: number } | null>(null);
  const [quizContent, setQuizContent] = useState<QuizContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load quiz content when a quiz is selected
  useEffect(() => {
    if (selectedQuiz === null) {
      setQuizContent(null);
      return;
    }

    const loadQuiz = async () => {
      setIsLoading(true);
      try {
        const category = quizCategories[selectedQuiz.categoryIndex];
        const quiz = category.quizzes[selectedQuiz.quizIndex];
        const content = await quiz.contentLoader();
        setQuizContent(content);
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [selectedQuiz]);

  // If no quiz selected, show menu with grouped categories
  if (selectedQuiz === null) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Select a Quiz
          </Typography>
          <Box sx={{ mt: 3 }}>
            {quizCategories.map((category, categoryIndex) => (
              <Box key={category.id} sx={{ mb: categoryIndex < quizCategories.length - 1 ? 3 : 0 }}>
                <Typography 
                  variant="h6" 
                  color="primary" 
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {category.name}
                </Typography>
                {category.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {category.quizzes.map((quiz, quizIndex) => (
                    <Button
                      key={quiz.id}
                      variant="contained"
                      size="large"
                      onClick={() => setSelectedQuiz({ categoryIndex, quizIndex })}
                    >
                      {quiz.name}
                    </Button>
                  ))}
                </Box>
                {categoryIndex < quizCategories.length - 1 && (
                  <Divider sx={{ mt: 3 }} />
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  }

  // Render selected quiz
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (quizContent) {
    return (
      <Box>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setSelectedQuiz(null)}
          >
            ← Back to Quiz Selection
          </Button>
        </Box>
        <QuizApp key={`${selectedQuiz?.categoryIndex}-${selectedQuiz?.quizIndex}`} content={quizContent} />
      </Box>
    );
  }

  return null;
};

export default App;
