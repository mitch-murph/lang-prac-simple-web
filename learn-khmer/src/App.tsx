import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import NavBar from './components/NavBar';
import AppRoutes from './router';
import { CharactersProvider } from './context/CharactersContext';

const App: React.FC = () => (
  <BrowserRouter>
    <CssBaseline />
    <CharactersProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar />
        <Box component="main">
          <AppRoutes />
        </Box>
      </Box>
    </CharactersProvider>
  </BrowserRouter>
);

export default App;
