import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Avatar,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IoSettingsSharp } from "react-icons/io5";
import { useEffect } from 'react';
import axios from 'axios';


const SettingsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  
  const[user,setUser] = useState(null)

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        withCredentials: true, // sends JWT cookie
      });
      setUser(res.data.user); // save user object from backend
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };
  fetchProfile();
}, []);


  

  const [preferences, setPreferences] = useState({
    notifications: true,
    themeDark: false,
  });

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  const handleSave = () => alert('Settings saved!');


  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        <IoSettingsSharp /> App Settings
      </Typography>


      <Card sx={{ mt: 2, borderRadius: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<AccountCircleIcon />} label="Account" />
          <Tab icon={<SettingsIcon />} label="Preferences" />
          <Tab icon={<InfoIcon />} label="About App" />
        </Tabs>

        <Divider />

        <CardContent>
          {/* ACCOUNT TAB */}
          {tabIndex === 0 && (
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 60, height: 60 }}>
                {user ? user.username[0] : "U"}
              </Avatar>
              <Typography variant="h6">{user ? user.username : "Loading..."}</Typography>
            </Box>

            <TextField
              label="Email"
              value={user ? user.email : ""}
              fullWidth
              disabled
            />
            <TextField
              label="Email"
              value={user ? user.phone : ""}
              fullWidth
              disabled
            />
            <TextField
              label="Password"
              value={user ? "********" : ""}
              fullWidth
              disabled
            />
          </Stack>
        )}


          {/* PREFERENCES TAB */}
          {tabIndex === 1 && (
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.notifications}
                    onChange={() => handleToggle('notifications')}
                  />
                }
                label="Enable Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.themeDark}
                    onChange={() => handleToggle('themeDark')}
                  />
                }
                label="Enable Dark Theme"
              />
              <Button variant="contained" onClick={handleSave}>
                Save Preferences
              </Button>
            </Stack>
          )}

          {/* ABOUT TAB */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                🗓️ Reminder App Features
              </Typography>
              <ul>
                <li>🔔 Smart Reminders & Alerts</li>
                <li>📅 Integrated Calendar View</li>
                <li>📝 Task & Customer Management</li>
                <li>📊 Dashboard Analytics</li>
                <li>💬 Email/SMS Integrations</li>
                <li>🧠 AI-Powered Follow-ups (coming soon)</li>
              </ul>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPage;

