import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const PortfolioSummaryCards = ({ portfolioData }) => {
  if (!portfolioData) return null;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card className="portfolio-card">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Investment
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {"$" + portfolioData.totalCost}
            </Typography>
            <Typography color="textSecondary" variant="small">
              Amount invested
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="portfolio-card">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Current Value
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {"$" + portfolioData.totalValue}
            </Typography>
            <Typography color="textSecondary" variant="small">
              Current holdings value
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className={`portfolio-card portfolio-card-${portfolioData.profitStatus}`}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total {portfolioData.profitStatus.toUpperCase()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {"$" + portfolioData.totalProfit}
              </Typography>
              {portfolioData.profitStatus === "profit" ? (
                <TrendingUpIcon sx={{ color: "#10b981" }} />
              ) : (
                <TrendingDownIcon sx={{ color: "#ef4444" }} />
              )}
            </Box>
            <Typography color="textSecondary" variant="small">
              {portfolioData.totalProfitPercent}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="portfolio-card">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              ROI
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: portfolioData.profitStatus === "profit" ? "#10b981" : "#ef4444",
              }}
            >
              {portfolioData.totalProfitPercent}%
            </Typography>
            <Typography color="textSecondary" variant="small">
              Return on investment
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PortfolioSummaryCards;
