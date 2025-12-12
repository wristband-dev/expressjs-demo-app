import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { Key } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { redirectToLogout } from '@wristband/react-client-auth';

export function SideDrawer() {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState(false);

  const drawerItemSx = {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      '& .MuiListItemIcon-root': {
        color: theme.palette.secondary.contrastText,
      },
    },
  };

  return (
    <>
      <Drawer
        PaperProps={{ sx: { paddingTop: '1rem', width: '12rem' } }}
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/home" onClick={() => setOpenDrawer(false)} sx={drawerItemSx}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/tokens" onClick={() => setOpenDrawer(false)} sx={drawerItemSx}>
              <ListItemIcon>
                <Key />
              </ListItemIcon>
              <ListItemText primary="Tokens" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/settings" onClick={() => setOpenDrawer(false)} sx={drawerItemSx}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => redirectToLogout('/api/auth/logout')} sx={drawerItemSx}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
          <Divider />
        </List>
      </Drawer>
      <IconButton sx={{ color: theme.palette.secondary.contrastText }} onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon />
      </IconButton>
    </>
  );
}
