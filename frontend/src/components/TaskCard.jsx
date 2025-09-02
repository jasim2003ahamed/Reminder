import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const TaskCard = ({ title, status, color }) => (
  <Card
    sx={{
      width: { xs: "100%", sm: 250 }, // full width on mobile, fixed width on sm+
      borderLeft: `6px solid ${color || "#ccc"}`,
      mb: 2, // spacing between cards
    }}
  >
    <CardContent
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 2 },
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>
      {status && (
        <Typography variant="body2" color="text.secondary">
          {status}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default TaskCard;
