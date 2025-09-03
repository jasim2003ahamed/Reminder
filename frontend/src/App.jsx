import React, { useState } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { Box, CssBaseline } from '@mui/material';

import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import Customer from './pages/CustomerPages';
import ReminderL from './pages/RemaninderL';
import ReminderReport from './components/ReminderReport';
import SettingsPage from './pages/SettingsPage';
import CalendarPage from './pages/CalendarPage';
import Task from './Task/TaskManager';
import Group from './pages/GroupPage';
import Employee from './components/Employee';

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const hideRoutes = ["/"];
  const showTopbar = !hideRoutes.includes(location.pathname);
  const showSidebar = !hideRoutes.includes(location.pathname);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {showTopbar && <Topbar onMenuClick={handleDrawerToggle} />}
      {showSidebar && (
        <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: { xs: '64px', sm: '64px' },
          ml: showSidebar ? { sm: '190px' } : 0,
          width: '100%',
        }}
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/reminderReport" element={<ReminderReport />} />
          <Route path="/reminder" element={<ReminderL />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/task" element={<Task />} />
          <Route path="/group" element={<Group />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
