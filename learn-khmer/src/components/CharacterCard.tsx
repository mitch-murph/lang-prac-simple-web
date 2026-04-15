import React from 'react';
import { Card, CardContent, Typography, Checkbox, Box } from '@mui/material';
import type { KhmerCharacter } from '../data/characters';
import AudioButton from './AudioButton';

interface CharacterCardProps {
  character: KhmerCharacter;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
  onPlay?: () => void;
  isPlaying?: boolean;
  onPlay2?: () => void;
  isPlaying2?: boolean;
  /** Highlight state for quiz feedback */
  highlight?: 'correct' | 'wrong' | 'none';
  onClick?: () => void;
  disabled?: boolean;
}

const highlightColors = {
  correct: '#2e7d32',
  wrong: '#c62828',
  none: undefined,
};

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  selectable = false,
  selected = false,
  onToggle,
  onPlay,
  isPlaying = false,
  onPlay2,
  isPlaying2 = false,
  highlight = 'none',
  onClick,
  disabled = false,
}) => {
  const bgColor = highlightColors[highlight];

  return (
    <Card
      onClick={selectable ? () => onToggle?.(character.id) : onClick}
      sx={{
        cursor: (selectable || onClick) ? 'pointer' : 'default',
        border: '2px solid',
        borderColor: bgColor ?? (selected ? 'primary.main' : 'divider'),
        bgcolor: bgColor ? `${bgColor}22` : 'background.paper',
        transition: 'border-color 0.2s, transform 0.1s',
        '&:hover': (selectable || (onClick && !disabled)) ? { transform: 'scale(1.04)', borderColor: 'primary.light' } : {},
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        position: 'relative',
      }}
      elevation={1}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, textAlign: 'center' }}>
        {selectable && (
          <Checkbox
            checked={selected}
            onChange={() => onToggle?.(character.id)}
            onClick={(e) => e.stopPropagation()}
            sx={{ position: 'absolute', top: 0, right: 0, p: 0.5 }}
            size="small"
          />
        )}
        <Typography variant="h3" sx={{ lineHeight: 1.2, mb: 0.5 }}>
          {character.character}
        </Typography>
        {character.romanization && (
          <Typography variant="caption" color="text.secondary">
            {character.romanization}
          </Typography>
        )}
        {(onPlay || onPlay2) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
            {onPlay && <AudioButton isPlaying={isPlaying} onPlay={onPlay} size="small" />}
            {onPlay2 && <AudioButton isPlaying={isPlaying2} onPlay={onPlay2} size="small" />}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CharacterCard;
