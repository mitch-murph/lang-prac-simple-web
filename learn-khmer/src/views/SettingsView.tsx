import React from 'react';
import {
  Box, Typography, Button, Stack, CircularProgress, Divider
} from '@mui/material';
import { useCharacters } from '../context/CharactersContext';
import AlphabetGrid from '../components/AlphabetGrid';
import { useSettingsStore, useEnabledSet } from '../store/settingsStore';

const SettingsView: React.FC = () => {
  const { characters, loading } = useCharacters();
  const enabledSet = useEnabledSet();
  const { toggleCharacter, enableAll, disableAll } = useSettingsStore();

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  const total = characters.length;
  const enabled = enabledSet.size;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Choose which characters appear in quizzes. Changes are saved automatically.
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2">
          {enabled} / {total} enabled
        </Typography>
        <Button size="small" variant="outlined" onClick={() => enableAll(characters.map((c) => c.id))}>
          Enable All
        </Button>
        <Button size="small" variant="outlined" color="error" onClick={disableAll}>
          Disable All
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <AlphabetGrid
        characters={characters}
        selectedIds={enabledSet}
        onToggle={toggleCharacter}
      />
    </Box>
  );
};

export default SettingsView;
