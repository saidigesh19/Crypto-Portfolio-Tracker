import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import DistributionChart from "../DistributionChart";


const PortfolioCharts = ({ holdings }) => (
  <Grid container spacing={3} sx={{ mb: 3 }}>
    <Grid item xs={12}>
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

export default PortfolioCharts;
