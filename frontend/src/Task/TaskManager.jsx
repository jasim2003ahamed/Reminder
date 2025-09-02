import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField, Select, MenuItem, InputLabel, FormControl,
  Button, Chip, Card, CardContent, Typography, Grid, Box, Stack
} from '@mui/material';
import { MdDelete, MdTask  } from "react-icons/md";


export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filterPriority, setFilterPriority] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Low',
    labels: '',
    date: new Date().toISOString().slice(0, 10), // default today
  });

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:5000/api/tasks${filterPriority ? `?priority=${filterPriority}` : ''}`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [filterPriority]);

  const handleCreate = async () => {
    await axios.post('http://localhost:5000/api/tasks', {
      ...form,
      labels: form.labels.split(',').map((l) => l.trim()),
    });
    setForm({
      title: '',
      description: '',
      priority: 'Low',
      labels: '',
      date: new Date().toISOString().slice(0, 10),
    });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        <MdTask /> Task & Priority Manager
      </Typography>

      {/* Create Form */}
      <Box
        component="form"
        sx={{
          mb: 5,
          p: 3,
          borderRadius: 3,
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 700,
        }}
      >
        <TextField label="Title" fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <TextField label="Description" multiline rows={3} fullWidth value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <TextField
          type="date"
          label="Task Date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            value={form.priority}
            label="Priority"
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Labels (comma separated)"
          fullWidth
          value={form.labels}
          onChange={(e) => setForm({ ...form, labels: e.target.value })}
        />

        <Button variant="contained" onClick={handleCreate} size="large">
          ➕ Add Task
        </Button>
      </Box>

      {/* Filter Section */}
      <Stack direction="row" spacing={2} alignItems="center" mb={4}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter Priority</InputLabel>
          <Select
            value={filterPriority}
            label="Filter Priority"
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => setFilterPriority('')}>
          Clear Filter
        </Button>
      </Stack>

      {/* Task Cards */}
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={600}>
                    {task.title}
                  </Typography>
                  <Chip
                    label={task.priority}
                    color={
                      task.priority === 'High'
                        ? 'error'
                        : task.priority === 'Medium'
                        ? 'warning'
                        : 'success'
                    }
                    size="small"
                  />
                </Box>

                <Typography mt={1} mb={2} color="text.secondary">
                  {task.description}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: {new Date(task.date).toLocaleDateString()}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={1}>
                  {task.labels.map((label, idx) => (
                    <Chip size="small" variant="outlined" key={idx} label={label} />
                  ))}
                </Box>

                <Button
                  variant="text"
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleDelete(task._id)}
                >
                  <MdDelete/>
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
