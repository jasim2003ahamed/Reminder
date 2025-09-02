// ✅ FRONTEND - Reminder.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Paper, Box,
  Select, MenuItem, Checkbox, ListItemText, FormControl, InputLabel, OutlinedInput, Autocomplete
} from '@mui/material';
import { MdDelete, MdEdit } from "react-icons/md";
import { SlBell } from "react-icons/sl";

const reminderTypes = [
  'Meeting', 'Client Follow-up', 'Payment Due',
  'Subscription/Service Renewal', 'Product Delivery', 'Custom'
];
const recurrenceOptions = ['One-time', 'Daily', 'Weekly', 'Monthly'];
const deliveryOptions = ['email', 'phone', 'whatsapp', 'emailgroup'];

export default function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Custom',
    notes: '',
    date: '',
    recurrence: 'One-time',
    deliveryMethods: [],
    email: '',
    phone: '',
    whatsapp: '',
    groupemail: []
  });
  const [editId, setEditId] = useState(null);
  const [emailGroups, setEmailGroups] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchReminders();
    fetchEmailGroups();
    fetchCustomers();
  }, []);

  const fetchReminders = async () => {
    const res = await axios.get('http://localhost:5000/api/reminders');
    setReminders(res.data);
  };

  const fetchEmailGroups = async () => {
    const res = await axios.get('http://localhost:5000/api/groups');
    setEmailGroups(res.data);
  };

  const fetchCustomers = async () => {
    const res = await axios.get('http://localhost:5000/api/customers');
    setCustomers(res.data);
  };

  const handleOpen = (reminder = null) => {
    if (reminder) {
      setFormData({
        ...reminder,
        date: reminder.date?.slice(0, 16),
        deliveryMethods: reminder.deliveryMethods || [],
        email: reminder.email || '',
        phone: reminder.phone || '',
        whatsapp: reminder.whatsapp || '',
        groupemail: reminder.groupemail || []
      });
      setEditId(reminder._id);
    } else {
      setFormData({
        title: '', type: 'Custom', notes: '', date: '', recurrence: 'One-time',
        deliveryMethods: [], email: '', phone: '', whatsapp: '', groupemail: []
      });
      setEditId(null);
    }
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'deliveryMethods' || name === 'groupemail') {
      setFormData((prev) => ({ ...prev, [name]: typeof value === 'string' ? value.split(',') : value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/reminders/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/reminders', formData);
      }
      fetchReminders();
      setDialogOpen(false);
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this reminder?')) {
      await axios.delete(`http://localhost:5000/api/reminders/${id}`);
      fetchReminders();
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom><SlBell /> Reminder Management</Typography>
      <Box mb={2}><Button variant="contained" onClick={() => handleOpen()}>+ Add Reminder</Button></Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Recurrence</TableCell>
              <TableCell>Delivery</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reminders.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.title}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>{r.notes}</TableCell>
                <TableCell>{new Date(r.date).toLocaleString()}</TableCell>
                <TableCell>{r.recurrence}</TableCell>
                <TableCell>{(r.deliveryMethods || []).join(', ')}</TableCell>
                <TableCell>
                  <Button size="large" onClick={() => handleOpen(r)}><MdEdit/></Button>
                  <Button size='large' color="error" onClick={() => handleDelete(r._id)}><MdDelete /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editId ? 'Edit' : 'Create'} Reminder</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Title" name="title" value={formData.title} onChange={handleChange} />
          <TextField select fullWidth margin="dense" label="Type" name="type" value={formData.type} onChange={handleChange}>
            {reminderTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
          </TextField>
          <TextField fullWidth margin="dense" label="Notes" name="notes" value={formData.notes} onChange={handleChange} />
          <TextField fullWidth margin="dense" type="datetime-local" label="Reminder Date" name="date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={handleChange} />
          <TextField select fullWidth margin="dense" label="Recurrence" name="recurrence" value={formData.recurrence} onChange={handleChange}>
            {recurrenceOptions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>

          <FormControl fullWidth margin="dense">
            <InputLabel id="delivery-methods-label">Preferred Choice</InputLabel>
            <Select
              labelId="delivery-methods-label"
              multiple
              name="deliveryMethods"
              value={formData.deliveryMethods}
              onChange={handleChange}
              input={<OutlinedInput label="Preferred Choice" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {deliveryOptions.map((method) => (
                <MenuItem key={method} value={method}>
                  <Checkbox checked={formData.deliveryMethods.includes(method)} />
                  <ListItemText primary={method} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.deliveryMethods.includes('email') && (
            <Autocomplete
              options={customers.map(c => c.email).filter(Boolean)}
              value={formData.email}
              onChange={(e, value) => setFormData(prev => ({ ...prev, email: value }))}
              renderInput={(params) => <TextField {...params} label="Email Address" margin="dense" fullWidth />}
              freeSolo
            />
          )}
          {formData.deliveryMethods.includes('phone') && (
            <Autocomplete
              options={customers.map(c => c.phone).filter(Boolean)}
              value={formData.phone}
              onChange={(e, value) => setFormData(prev => ({ ...prev, phone: value }))}
              renderInput={(params) => <TextField {...params} label="Phone Number" margin="dense" fullWidth />}
              freeSolo
            />
          )}
          {formData.deliveryMethods.includes('whatsapp') && (
            <TextField fullWidth margin="dense" label="WhatsApp Number" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
          )}
          {formData.deliveryMethods.includes('emailgroup') && (
            <FormControl fullWidth margin="dense">
              <InputLabel id="email-groups-label">Email Groups</InputLabel>
              <Select
                labelId="email-groups-label"
                multiple
                name="groupemail"
                value={formData.groupemail}
                onChange={handleChange}
                input={<OutlinedInput label="Email Groups" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {emailGroups.map((group) => (
                  <MenuItem key={group._id} value={group.name}>
                    <Checkbox checked={formData.groupemail.includes(group.name)} />
                    <ListItemText primary={group.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
