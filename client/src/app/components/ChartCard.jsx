import { Card, CardContent, Typography, Box } from "@mui/material";

function ChartCard({ title, children, height = 320 }) {
  return (
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: "100%", height }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

export default ChartCard;
