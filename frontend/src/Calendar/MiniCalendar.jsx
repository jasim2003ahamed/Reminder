import { IconButton, Tooltip } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const MiniCalendar = ({ onOpenFull }) => {
  return (
    <Tooltip title="Open Calendar">
      <IconButton
        onClick={onOpenFull}
        sx={{
          bgcolor: '#1976d2',
          color: '#fff',
          '&:hover': {
            bgcolor: '#1565c0',
          },
        }}
      >
        <CalendarMonthIcon />
      </IconButton>
    </Tooltip>
  );
};

export default MiniCalendar;
