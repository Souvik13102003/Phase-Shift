// frontend/src/components/Sidebar.js
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Toolbar,
  AppBar,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  UploadFile as UploadIcon,
  PersonAdd as PersonAddIcon,
  ListAlt as ListAltIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const Sidebar = ({ variant }) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/upload">
          <ListItemIcon><UploadIcon /></ListItemIcon>
          <ListItemText primary="Upload Excel" />
        </ListItem>
        <ListItem button component={Link} to="/add-student">
          <ListItemIcon><PersonAddIcon /></ListItemIcon>
          <ListItemText primary="Add Student" />
        </ListItem>
        <ListItem button component={Link} to="/view-all-students">
          <ListItemIcon><ListAltIcon /></ListItemIcon>
          <ListItemText primary="Student List" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      {variant === 'temporary' && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant={variant}
        open={variant === 'temporary' ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: variant === 'temporary' ? '0' : undefined,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
