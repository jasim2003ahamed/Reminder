import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  EventAvailable,
  AlarmOn,
  Assessment,
  Group,
  Person
} from '@mui/icons-material';
import axios from 'axios';
import MiniCalendar from '../Calendar/MiniCalendar';
import FullOverlayCalendar from '../Calendar/FullOverlayCalendar';
import { SlChart,  SlBell } from "react-icons/sl";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    tasksToday: 0,
    remindersUpcoming: 0,
    overdueCount: 0,
    customerCount: 0,
  });

  const [recentReminders, setRecentReminders] = useState([]);
  const [recentCustomerReminders, setRecentCustomerReminders] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchRecentReminders();
    fetchRecentCustomerReminders();
  }, []);

  const fetchStats = async () => {
    try {
      const [taskRes, reminderRes, customerRes, employeeRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks'),
        axios.get('http://localhost:5000/api/reminders'),
        axios.get('http://localhost:5000/api/customers'),
        axios.get('http://localhost:5000/api/employee'),
      ]);

      const now = new Date();
      const todayISO = now.toISOString().slice(0, 10);

      const tasksToday = taskRes.data.filter(
        (t) => t.date && t.date.slice(0, 10) === todayISO
      );

      const upcoming = reminderRes.data.filter((r) => new Date(r.date) > now);
      const overdue = reminderRes.data.filter((r) => new Date(r.date) < now);

      setStats({
        tasksToday: tasksToday.length,
        remindersUpcoming: upcoming.length,
        overdueCount: overdue.length,
        customerCount: customerRes.data.length,
        employeeCount: employeeRes.data.length
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchRecentReminders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reminders');
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentReminders(sorted.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch recent reminders', err);
    }
  };

  const fetchRecentCustomerReminders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      const filtered = res.data.filter((c) => c.reminderDate);
      const sorted = filtered.sort(
        (a, b) => new Date(b.reminderDate) - new Date(a.reminderDate)
      );
      setRecentCustomerReminders(sorted.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch recent customer reminders', err);
    }
  };

  const statCards = [
    {
      label: "Today's Tasks",
      icon: <EventAvailable />,
      value: stats.tasksToday,
      color: '#1976d2',
    },
    {
      label: 'Upcoming Reminders',
      icon: <AlarmOn />,
      value: stats.remindersUpcoming,
      color: '#2e7d32',
    },
    {
      label: 'Overdue Reminders',
      icon: <Assessment />,
      value: stats.overdueCount,
      color: '#d32f2f',
    },
    {
      label: 'Total Customers',
      icon: <Group />,
      value: stats.customerCount,
      color: '#9c27b0',
    },
    {
      label: 'Total Employees',
      icon: <Person />,
      value: stats.employeeCount,
      color: "#4caf50"
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          <SlChart /> Dashboard Analytics
        </Typography>
        <MiniCalendar onOpenFull={() => setShowCalendar(true)} />
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper elevation={4} sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 3 }}>
              <Avatar sx={{ bgcolor: card.color, mr: 2 }}>{card.icon}</Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Reminders */}
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          <SlBell /> Recent General Reminders
        </Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {recentReminders.map((r, i) => (
              <React.Fragment key={r._id}>
                <ListItem>
                  <ListItemText
                    primary={`${r.title} - ${r.type || 'N/A'} - ${r.notes || 'No note'}`}
                    secondary={new Date(r.date).toLocaleString()}
                  />
                </ListItem>
                {i !== recentReminders.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Recent Customer Reminders */}
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          <SlBell /> Recent Customer Reminders
        </Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {recentCustomerReminders.map((r, i) => (
              <React.Fragment key={r._id}>
                <ListItem>
                  <ListItemText
                    primary={`${r.name} – ${r.note || 'No note'}`}
                    secondary={`📅 ${new Date(r.reminderDate).toLocaleString()}`}
                  />
                </ListItem>
                {i !== recentCustomerReminders.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Calendar */}
      <FullOverlayCalendar open={showCalendar} onClose={() => setShowCalendar(false)} />
    </Box>
  );
};

export default DashboardPage;
