import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery, useTheme, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HearingIcon from '@mui/icons-material/Hearing';
import AbcIcon from '@mui/icons-material/Abc';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> },
  { label: 'Alphabet', path: '/alphabet', icon: <MenuBookIcon fontSize="small" /> },
  { label: 'Sound → Char', path: '/quiz/sound-to-char', icon: <HearingIcon fontSize="small" /> },
  { label: 'Char → Sound', path: '/quiz/char-to-sound', icon: <AbcIcon fontSize="small" /> },
  { label: 'Handwriting', path: '/quiz/handwriting', icon: <EditIcon fontSize="small" /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon fontSize="small" /> },
];

const NavBar: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
          🇰🇭 Learn Khmer
        </Typography>
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              {NAV_LINKS.map((link) => (
                <MenuItem
                  key={link.path}
                  component={Link}
                  to={link.path}
                  selected={location.pathname === link.path}
                  onClick={() => setAnchorEl(null)}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText>{link.label}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                color="inherit"
                variant={location.pathname === link.path ? 'outlined' : 'text'}
                size="small"
                startIcon={link.icon}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
