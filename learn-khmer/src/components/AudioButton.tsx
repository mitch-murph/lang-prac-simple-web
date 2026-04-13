import React from 'react';
import { IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';

interface AudioButtonProps {
  isPlaying: boolean;
  onPlay: () => void;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'default' | 'inherit';
}

const AudioButton: React.FC<AudioButtonProps> = ({
  isPlaying,
  onPlay,
  size = 'medium',
  color = 'primary',
}) => (
  <IconButton onClick={onPlay} color={color} size={size}>
    {isPlaying ? <StopIcon fontSize={size} /> : <VolumeUpIcon fontSize={size} />}
  </IconButton>
);

export default AudioButton;
