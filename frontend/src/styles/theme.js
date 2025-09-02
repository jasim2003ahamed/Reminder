// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5', // blue
    },
    secondary: {
      main: '#d81b60', // pink
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h5: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
        },
      },
    },
     MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,        // ⬅️ Makes table headers bold
          fontSize: '0.95rem',
          color: '#1e1e1e',
          
        },
      },
    },
  },
});

export default theme;
