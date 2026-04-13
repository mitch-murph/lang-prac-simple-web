import React, { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface HandwritingPadProps {
  /** Shows the answer character overlay when true */
  showAnswer: boolean;
  answerCharacter: string;
  onClear?: () => void;
}

export interface HandwritingPadHandle {
  clear: () => void;
}

const HandwritingPad = forwardRef<HandwritingPadHandle, HandwritingPadProps>(
  ({ showAnswer, answerCharacter, onClear }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear?.();
  }, [onClear]);

  // Expose clear() to parent via ref
  useImperativeHandle(ref, () => ({ clear: clearCanvas }), [clearCanvas]);

  const getPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).nativeEvent.offsetX, y: (e as React.MouseEvent).nativeEvent.offsetY };
  };

  // Setup canvas style once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = '#1565c0';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!drawing || !lastPos.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDrawing = () => {
    setDrawing(false);
    lastPos.current = null;
  };

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          border: '2px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: '#fafafa',
        }}
      >
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ display: 'block', touchAction: 'none' }}
        />
        {showAnswer && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.7)',
              pointerEvents: 'none',
            }}
          >
            <Typography variant="h1" sx={{ fontSize: '10rem', lineHeight: 1, opacity: 0.85 }}>
              {answerCharacter}
            </Typography>
          </Box>
        )}
      </Box>
      <Stack direction="row" sx={{ mt: 1 }} justifyContent="center">
        <Button startIcon={<DeleteIcon />} size="small" onClick={clearCanvas} variant="outlined">
          Clear
        </Button>
      </Stack>
    </Box>
  );
});

HandwritingPad.displayName = 'HandwritingPad';

export default HandwritingPad;
