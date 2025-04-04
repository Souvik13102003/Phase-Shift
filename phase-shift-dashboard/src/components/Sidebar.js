import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/upload">
          <ListItemText primary="Upload Excel" />
        </ListItem>
        <ListItem button component={Link} to="/add-student">
          <ListItemText primary="Add Student" />
        </ListItem>
        <ListItem button component={Link} to="/view-all-students">
          <ListItemText primary="Student List" />
        </ListItem>
        <ListItem button component={Link} to="/billing">
          <ListItemText primary="Billing" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
