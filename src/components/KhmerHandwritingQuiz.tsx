
import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';

interface KhmerHandwritingQuizProps {
  audioSrc: string;
  correctCharacter: string;
  showAnswer?: boolean;
  setShowAnswer?: (show: boolean) => void;
  onNext?: () => void;
  progress?: string;
}

const KhmerHandwritingQuiz: React.FC<KhmerHandwritingQuizProps> = ({ audioSrc, correctCharacter, showAnswer: showAnswerProp, setShowAnswer, onNext, progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const showAnswer = showAnswerProp ?? false;

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.play();
  }, [audioSrc]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const playAudio = () => {
    const audio = new Audio(audioSrc);
    audio.play();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
        {progress && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {progress}
          </Typography>
        )}
        <Typography variant="h5" gutterBottom>
          Listen and Write the Character
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={playAudio}
          sx={{ mb: 2 }}
        >
          🔊 Play Audio
        </Button>
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            style={{ border: '2px solid #1976d2', background: '#fff', borderRadius: 8, touchAction: 'none' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" color="secondary" onClick={clearCanvas}>Clear</Button>
          <Button variant="contained" color="success" onClick={() => setShowAnswer && setShowAnswer(true)} disabled={showAnswer}>Reveal Answer</Button>
          {onNext && (
            <Button variant="outlined" color="primary" onClick={onNext}>Next →</Button>
          )}
        </Box>
        {showAnswer && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Correct answer:</Typography>
            <Typography variant="h2" sx={{ color: '#1976d2', lineHeight: 1.2 }}>
              {correctCharacter}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default KhmerHandwritingQuiz;
