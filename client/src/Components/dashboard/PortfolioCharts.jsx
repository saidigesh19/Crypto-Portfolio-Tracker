import React from "react";
import { Grid, Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import PortfolioChart from "../PortfolioChart";
import DistributionChart from "../DistributionChart";

const PortfolioCharts = ({ chartWindow, setChartWindow, chartPoints, coinSeries, holdings }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Card className="portfolio-card">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Portfolio (recent)
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="chart-window-label">Average Window</InputLabel>
                <Select
                  labelId="chart-window-label"
                  value={chartWindow}
                  label="Average Window"
                  onChange={(e) => setChartWindow(e.target.value)}
                >
                  <MenuItem value="1d">1 Day</MenuItem>
                  <MenuItem value="2d">2 Days</MenuItem>
                  <MenuItem value="1w">1 Week</MenuItem>
                  <MenuItem value="all">All</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <PortfolioChart points={chartPoints} coinSeries={coinSeries} windowOption={chartWindow} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card className="portfolio-card">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Portfolio Distribution
            </Typography>
            <DistributionChart holdings={holdings} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PortfolioCharts;
