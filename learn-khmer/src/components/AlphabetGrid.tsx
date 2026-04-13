import React from 'react';
import { Grid } from '@mui/material';
import CharacterCard from './CharacterCard';
import type { KhmerCharacter } from '../data/characters';

interface AlphabetGridProps {
  characters: KhmerCharacter[];
  /** Ids of currently selected (enabled) characters — used in Settings */
  selectedIds?: Set<string>;
  onToggle?: (id: string) => void;
  onPlay?: (char: KhmerCharacter) => void;
  playingId?: string | null;
  /** Quiz highlight per character id */
  highlights?: Record<string, 'correct' | 'wrong' | 'none'>;
  onCardClick?: (char: KhmerCharacter) => void;
  disabledIds?: Set<string>;
}

const AlphabetGrid: React.FC<AlphabetGridProps> = ({
  characters,
  selectedIds,
  onToggle,
  onPlay,
  playingId,
  highlights,
  onCardClick,
  disabledIds,
}) => (
  <Grid container spacing={1.5} justifyContent="center">
    {characters.map((char) => (
      <Grid key={char.id} size={{ xs: 4, sm: 3, md: 2, lg: 2 }}>
        <CharacterCard
          character={char}
          selectable={!!selectedIds}
          selected={selectedIds?.has(char.id) ?? false}
          onToggle={onToggle}
          onPlay={onPlay ? () => onPlay(char) : undefined}
          isPlaying={playingId === char.id}
          highlight={highlights?.[char.id] ?? 'none'}
          onClick={onCardClick ? () => onCardClick(char) : undefined}
          disabled={disabledIds?.has(char.id)}
        />
      </Grid>
    ))}
  </Grid>
);

export default AlphabetGrid;
