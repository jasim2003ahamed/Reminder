import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Input,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import * as XLSX from "xlsx";
import { MdDelete, MdEdit } from "react-icons/md";
import { TfiClipboard } from "react-icons/tfi";


export default function Customer() {
  const [file, setFile] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [editCustomer, setEditCustomer] = useState(null);
  const [reminderEdit, setReminderEdit] = useState({
    open: false,
    id: null,
    value: null,
  });
  const [newCustomerDialog, setNewCustomerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    purchaseDate: "",
    note: "",
    address: "", 
    dob: "", 
    preferredDelivery: [],
    
  });
  const fileInputRef = useRef();
  const deliveryOptions = ["email", "sms", "whatsapp"];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch {
      alert("Failed to fetch customers");
    }
  };
  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const fileBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });
    const formData = new FormData();
    formData.append("file", new Blob([fileBuffer]), "uploaded.xlsx");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/customers/upload",
        formData,
      );
      const { insertedCount, skipped = [] } = res.data;

      let msg = `✅ Upload successful\nInserted: ${insertedCount}`;
      if (skipped.length) {
        msg += `\nSkipped Duplicates:\n${skipped.map((c) => `${c.name} (${c.email || c.phone})`).join("\n")}`;
      }
      alert(msg);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  //sample Download Excel
   const handleDownloadSample = () => {
    const sampleData = [
      {
        
        name: "John Doe",
        email: "john@example.com",
        phone: "9876543210",
        purchaseDate: "2025-05-07",
        note: "Repeat customer",
        address: "123 Street",
        dob: "1990-01-01",
        preferredDelivery: ["email","sms"],
        
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample_customer.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      fetchCustomers();
    } catch {
      alert("Delete failed");
    }
  };

  const handleEditOpen = (c) => setEditCustomer({ ...c });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "preferredDelivery") {
      setEditCustomer((prev) => ({
        ...prev,
        preferredDelivery: typeof value === "string" ? value.split(",") : value,
      }));
    } else {
      setEditCustomer({ ...editCustomer, [name]: value });
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/customers/${editCustomer._id}`,
        editCustomer,
      );
      setEditCustomer(null);
      fetchCustomers();
    } catch {
      alert("Failed to update");
    }
  };

  const handleReminderEditOpen = (id, value) => {
    setReminderEdit({
      open: true,
      id,
      value: value ? new Date(value) : new Date(),
    });
  };

  const handleReminderEditSave = async () => {
    try {
      const formattedDate = reminderEdit.value
        ? new Date(reminderEdit.value).toISOString()
        : null;
      await axios.put(
        `http://localhost:5000/api/customers/${reminderEdit.id}`,
        {
          reminderDate: formattedDate,
        },
      );
      setReminderEdit({ open: false, id: null, value: null });
      fetchCustomers();
    } catch {
      alert("Failed to save reminder");
    }
  };

  const handleNoteChange = async (id, note) => {
    await axios.put(`http://localhost:5000/api/customers/${id}`, { note });
    fetchCustomers();
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    if (name === "preferredDelivery") {
      setNewCustomer((prev) => ({
        ...prev,
        preferredDelivery: typeof value === "string" ? value.split(",") : value,
      }));
    } else {
      setNewCustomer({ ...newCustomer, [name]: value });
    }
  };

  const handleAddCustomer = async () => {
    try {
      await axios.post("http://localhost:5000/api/customers", newCustomer);
      setNewCustomerDialog(false);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        purchaseDate: "",
        note: "",
        address: "",
        dob: "",
        preferredDelivery: [],
      });
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add customer");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          <TfiClipboard /> Customer Management
        </Typography>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Box
            display="flex"
            gap={2}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <Input
              type="file"
              inputRef={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button variant="contained" onClick={handleUpload}>
              Upload Excel
            </Button>
            <Button variant="contained" color="secondary" onClick={handleDownloadSample}>
              Download Sample
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setNewCustomerDialog(true)}
            >
              Add Customer
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ overflowX: "auto" }}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell>Sr.No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Reminder</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>DOB</TableCell>    
                <TableCell>Preferred Delivery</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((c, idx) => (
                <TableRow key={c._id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>
                    {c.purchaseDate
                      ? new Date(c.purchaseDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() =>
                        handleReminderEditOpen(c._id, c.reminderDate)
                      }
                    >
                      {c.reminderDate
                        ? new Date(c.reminderDate).toLocaleString()
                        : "Set"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={c.note || ""}
                      fullWidth
                      onChange={(e) => {
                        const updated = customers.map((item) =>
                          item._id === c._id
                            ? { ...item, note: e.target.value }
                            : item,
                        );
                        setCustomers(updated);
                      }}
                      onBlur={() => handleNoteChange(c._id, c.note)}
                    />
                  </TableCell>
                  <TableCell>{c.address || "-"}</TableCell>
                  <TableCell>
                    {c.dob ? new Date(c.dob).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(c.preferredDelivery)
                      ? c.preferredDelivery.join(", ")
                      : c.preferredDelivery || "-"}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEditOpen(c)}>
                      <MdEdit />
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(c._id)}
                    >
                      <MdDelete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Reminder Dialog */}
        <Dialog
          open={reminderEdit.open}
          onClose={() =>
            setReminderEdit({ open: false, id: null, value: null })
          }
        >
          <DialogTitle>Set Reminder</DialogTitle>
          <DialogContent>
            <DateTimePicker
              label="Reminder Date"
              value={reminderEdit.value}
              onChange={(newValue) =>
                setReminderEdit((prev) => ({ ...prev, value: newValue }))
              }
              minDateTime={new Date()}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setReminderEdit({ open: false, id: null, value: null })
              }
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleReminderEditSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Customer Dialog */}
        <Dialog
          open={newCustomerDialog}
          onClose={() => setNewCustomerDialog(false)}
        >
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="dense"
              value={newCustomer.name}
              onChange={handleNewCustomerChange}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="dense"
              value={newCustomer.email}
              onChange={handleNewCustomerChange}
            />
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              margin="dense"
              value={newCustomer.phone}
              onChange={handleNewCustomerChange}
            />
            <TextField
              label="Purchase Date"
              name="purchaseDate"
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={newCustomer.purchaseDate}
              onChange={handleNewCustomerChange}
            />
            <TextField
              label="Note"
              name="note"
              fullWidth
              margin="dense"
              value={newCustomer.note}
              onChange={handleNewCustomerChange}
            />
            <TextField
            label="Address"
            name="address"
            fullWidth
            margin="dense"
            value={newCustomer.address}
            onChange={handleNewCustomerChange}
            />

            <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={newCustomer.dob}
            onChange={handleNewCustomerChange}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel id="preferred-label">Preferred Delivery</InputLabel>
              <Select
                labelId="preferred-label"
                multiple
                name="preferredDelivery"
                input={<OutlinedInput label="Preferred Delivery" />}
                value={newCustomer.preferredDelivery}
                onChange={handleNewCustomerChange}
                renderValue={(selected) => selected.join(", ")}
              >
                {deliveryOptions.map((method) => (
                  <MenuItem key={method} value={method}>
                    <Checkbox
                      checked={newCustomer.preferredDelivery.includes(method)}
                    />
                    <ListItemText primary={method.toUpperCase()} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewCustomerDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddCustomer}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog open={!!editCustomer} onClose={() => setEditCustomer(null)}>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="dense"
              value={editCustomer?.name || ""}
              onChange={handleEditChange}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="dense"
              value={editCustomer?.email || ""}
              onChange={handleEditChange}
            />
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              margin="dense"
              value={editCustomer?.phone || ""}
              onChange={handleEditChange}
            />
            <TextField
              label="Note"
              name="note"
              fullWidth
              margin="dense"
              value={editCustomer?.note || ""}
              onChange={handleEditChange}
            />
            <TextField
              label="Address"
              name="address"
              fullWidth
              margin="dense"
              value={editCustomer?.address || ""}
              onChange={handleEditChange}
            />

            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={editCustomer?.dob || ""}
              onChange={handleEditChange}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel id="edit-preferred-label">
                Preferred Delivery
              </InputLabel>
              <Select
                labelId="edit-preferred-label"
                multiple
                name="preferredDelivery"
                input={<OutlinedInput label="Preferred Delivery" />}
                value={editCustomer?.preferredDelivery || []}
                onChange={handleEditChange}
                renderValue={(selected) => selected.join(", ")}
              >
                {deliveryOptions.map((method) => (
                  <MenuItem key={method} value={method}>
                    <Checkbox
                      checked={editCustomer?.preferredDelivery?.includes(
                        method,
                      )}
                    />
                    <ListItemText primary={method.toUpperCase()} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditCustomer(null)}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
}
