import React, { useEffect, useState } from 'react'
import { ImManWoman } from "react-icons/im";
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
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import axios from 'axios'


const Employee = () => {

  const [search,setSearch] = useState('')

  const [searchResults,setSearchResults] = useState([])

  const [employees,setEmployees] = useState([])

  const [newEmployeeDialog,setNewEmployeeDialog] = useState(null)

  const [newEmployee,setNewEmployee] = useState({
    name:'',
    email:'',
    phone:'',
    dob:'',
    address:'',
    bloodgroup:'',
    doj:'',
    department:''
  })

  
    useEffect(() => {
    const filterResults = employees.filter((emploee) => 
      ((emploee.name).toLowerCase()).startsWith(search.toLowerCase()))
    setSearchResults(filterResults.reverse())
    },[employees,search])

   useEffect(() => {
      fetchEmployee();
    }, []);
  
    const fetchEmployee = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employee");
        setEmployees(res.data);
      } catch {
        alert("Failed to fetch customers");
      }
    };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    if (name === "preferredDelivery") {
      setNewEmployee((prev) => ({
        ...prev,
        preferredDelivery: typeof value === "string" ? value.split(",") : value,
      }));
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
    }
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone) {
    alert("Name, Email, and Phone are required!");
    return;
  }

  try {
    // Send POST request to backend
    const response = await axios.post('http://localhost:5000/api/employee', newEmployee);

    // Assuming the backend returns the newly created employee
    const addedEmployee = response.data;

    // Update local state
    setEmployees([...employees, addedEmployee]);

    // Close dialog
    setNewEmployeeDialog(false);

    // Reset form
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      dob: '',
      address: '',
      bloodgroup: '',
      doj: '',
      department: ''
    });

    console.log("Employee added successfully!");
  } catch (error) {
    console.error("Error adding employee:", error);
    alert("Failed to add employee. Try again.");
  }
};

  const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/employee/${id}`);
    const delEmployee = employees.filter((e) => e._id !== id);
    setEmployees(delEmployee);
  } catch (error) {
    alert("Failed to delete employee. Try again.");
  }
};


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>

      <Typography variant='h4' gutterBottom>
        <ImManWoman />Employee Management
      </Typography>

      <Paper sx={{ p:2, mb:6 }}>
        <Box
          display='flex'
          gap={2}
          flexDirection={{ xs: "column", sm: "row" }}
        > 
          <Input 
            type='text'
            name='search'
            placeholder='Search'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="contained"
            color="success"
            onClick={() => setNewEmployeeDialog(true)}
          >
            Add Employee
          </Button>
        </Box>
      </Paper>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr.No</TableCell>
            <TableCell>Emp.ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>DOB</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Blood Group</TableCell>
            <TableCell>Date of Joining</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchResults.map((e,idx) => (
            <TableRow key={e._id}>
              <TableCell>{idx+1}</TableCell>
              <TableCell>{e.empid}</TableCell>
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.email}</TableCell>
              <TableCell>{e.phone}</TableCell>
              <TableCell>{e.dob}</TableCell>
              <TableCell>{e.address}</TableCell>
              <TableCell>{e.bloodgroup}</TableCell>
              <TableCell>{e.doj}</TableCell>
              <TableCell>{e.department}</TableCell>
              <TableCell>
                <Button size='small' color='error' onClick={() => handleDelete(e._id)}><MdDelete /></Button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog 
        open={newEmployeeDialog}
        onClose={() => setNewEmployeeDialog(false)}
      >
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <TextField 
            required
            label='Emp Id'
            name='empid'
            fullWidth
            margin='dense'
            value={newEmployee.empid}
            onChange={handleNewCustomerChange}
          />
          <TextField 
            required
            label='Name'
            name='name'
            fullWidth
            margin='dense'
            value={newEmployee.name}
            onChange={handleNewCustomerChange}
          />
          <TextField 
            label='Email'
            name='email'
            fullWidth
            margin='dense'
            value={newEmployee.email}
            onChange={handleNewCustomerChange}
          />
          <TextField 
            label='Phone'
            name='phone'
            fullWidth
            margin='dense'
            value={newEmployee.phone}
            onChange={handleNewCustomerChange}
          />
          <TextField 
            label='DOB'
            name='dob'
            type='date'
            fullWidth
            margin='dense'
            InputLabelProps={{ shrink: true }}
            value={newEmployee.dob}
            onChange={handleNewCustomerChange}
          />
          <TextField 
            label='Address'
            name='address'
            fullWidth
            margin='dense'
            value={newEmployee.address}
            onChange={handleNewCustomerChange}
          />
          <TextField 
            label='Blood Group'
            name='bloodgroup'
            fullWidth
            margin='dense'
            value={newEmployee.bloodgroup}
            onChange={handleNewCustomerChange}
          />
          <TextField 
            label='Date of Joining'
            name='doj'
            type='date'
            fullWidth
            margin='dense'
            InputLabelProps={{ shrink: true }}
            value={newEmployee.doj}
            onChange={handleNewCustomerChange}
          />
          <TextField 
            label='Department'
            name='department'
            fullWidth
            margin='dense'
            value={newEmployee.department}
            onChange={handleNewCustomerChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setNewEmployeeDialog(false)}>Cancel</Button>
          <Button onClick={() => handleAddEmployee()} variant='contained'>Add</Button>
        </DialogActions>
      </Dialog>

    </Container>

  )
}

export default Employee