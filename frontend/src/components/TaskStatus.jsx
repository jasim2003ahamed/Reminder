import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const ColorCircularProgress = styled(CircularProgress)(({ colorcode }) => ({
  color: colorcode,
  marginRight: "1rem",
}));

const TaskStatus = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // column on mobile, row on larger screens
        flexWrap: { sm: "wrap" },
        gap: 4,
        mb: 4,
        alignItems: "flex-start",
        justifyContent: { sm: "space-between" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ColorCircularProgress variant="determinate" value={70} colorcode="#69db7c" />
        <Typography>Completed</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ColorCircularProgress variant="determinate" value={40} colorcode="#4dabf7" />
        <Typography>In Progress</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ColorCircularProgress variant="determinate" value={20} colorcode="#ffa94d" />
        <Typography>Not Started</Typography>
      </Box>
    </Box>
  );
};

export default TaskStatus;
