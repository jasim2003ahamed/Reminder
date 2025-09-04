import React, { useState, useEffect } from "react";
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
  Stack,
  Avatar,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IoSettingsSharp } from "react-icons/io5";
import axios from "axios";
import { SlChart, SlBell, SlCalender } from "react-icons/sl";
import { MdTask } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { GiBrain } from "react-icons/gi";

const SettingsPage = ({ darkMode, setDarkMode }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [user, setUser] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

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
                <Typography variant="h6">
                  {user ? user.username : "Loading..."}
                </Typography>
              </Box>

              <TextField
                label="Email"
                value={user ? user.email : ""}
                fullWidth
                disabled
              />
              <TextField
                label="Phone"
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
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                }
                label="Enable Dark Theme"
              />

            </Stack>
          )}

          {/* ABOUT TAB */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                <SlCalender /> Reminder App Features
              </Typography>
              <ul>
                <li>
                  <SlBell /> Smart Reminders & Alerts
                </li>
                <li>
                  <SlCalender /> Integrated Calendar View
                </li>
                <li>
                  <MdTask /> Task & Customer Management
                </li>
                <li>
                  <SlChart /> Dashboard Analytics
                </li>
                <li>
                  <LuMessageCircleMore /> Email/SMS Integrations
                </li>
                <li>
                  <GiBrain /> AI-Powered Follow-ups (coming soon)
                </li>
              </ul>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPage;
