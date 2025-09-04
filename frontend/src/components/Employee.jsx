import React, { useEffect, useState } from "react";
import { ImManWoman } from "react-icons/im";
import {
  Container,
  Typography,
  Button,
  Paper,
  Input,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const Employee = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [newEmployeeDialog, setNewEmployeeDialog] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    empid: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    bloodgroup: "",
    doj: "",
    department: "",
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employee");
      setEmployees(res.data);
    } catch {
      alert("Failed to fetch employees");
    }
  };

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone) {
      alert("Name, Email, and Phone are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employee",
        newEmployee
      );
      setEmployees([...employees, response.data]);
      setNewEmployeeDialog(false);

      setNewEmployee({
        empid: "",
        name: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
        bloodgroup: "",
        doj: "",
        department: "",
      });
    } catch (error) {
      alert("Failed to add employee. Try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employee/${id}`);
      setEmployees(employees.filter((e) => e._id !== id));
    } catch (error) {
      alert("Failed to delete employee. Try again.");
    }
  };

  // Columns config for DataGrid
  const columns = [
    { field: "id", headerName: "Sr.No", width: 80 },
    { field: "empid", headerName: "Emp.ID", width: 120 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 140 },
    { field: "dob", headerName: "DOB", width: 105 },
    { field: "address", headerName: "Address", width: 180 },
    { field: "bloodgroup", headerName: "Blood Group", width: 150 },
    { field: "doj", headerName: "Joining Date", width: 105 },
    { field: "department", headerName: "Department", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => handleDelete(params.row._id)}
        >
          <MdDelete />
        </Button>
      ),
    },
  ];

  // Convert employees into DataGrid rows
  const rows = employees
    .filter((e) =>
      e.name.toLowerCase().startsWith(search.toLowerCase())
    )
    .map((e, idx) => ({
      id: idx + 1,
      ...e,
    }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        <ImManWoman /> Employee Management
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => setNewEmployeeDialog(true)}
          >
            Add Employee
          </Button>
          <Input
            type="text"
            name="search"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Paper>

      {/* ✅ DataGrid with drag & drop columns */}
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          checkboxSelection
          experimentalFeatures={{ columnReordering: true }}
        />
      </div>

      {/* Add Employee Dialog */}
      <Dialog
        open={newEmployeeDialog}
        onClose={() => setNewEmployeeDialog(false)}
      >
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          {[
            { label: "Emp Id", name: "empid" },
            { label: "Name", name: "name" },
            { label: "Email", name: "email" },
            { label: "Phone", name: "phone" },
            { label: "DOB", name: "dob", type: "date" },
            { label: "Address", name: "address" },
            { label: "Blood Group", name: "bloodgroup" },
            { label: "Date of Joining", name: "doj", type: "date" },
            { label: "Department", name: "department" },
          ].map((field) => (
            <TextField
              key={field.name}
              required={field.name === "name" || field.name === "email"}
              label={field.label}
              name={field.name}
              type={field.type || "text"}
              fullWidth
              margin="dense"
              InputLabelProps={field.type === "date" ? { shrink: true } : {}}
              value={newEmployee[field.name]}
              onChange={handleNewEmployeeChange}
            />
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setNewEmployeeDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEmployee} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Employee;
