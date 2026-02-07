import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const PortfolioSummaryCards = ({ portfolioData }) => {
  if (!portfolioData) return null;

  return (
    <Grid container spacing={2} sx={{ mb: 4, display: 'flex' }}>
      {[{
        label: 'Total Investment',
        value: `$${portfolioData.totalCost}`,
        caption: 'Amount invested',
      }, {
        label: 'Current Value',
        value: `$${portfolioData.totalValue}`,
        caption: 'Current holdings value',
      }, {
        label: `Total ${portfolioData.profitStatus.toUpperCase()}`,
        value: `$${portfolioData.totalProfit}`,
        caption: `${portfolioData.totalProfitPercent}%`,
        icon: portfolioData.profitStatus === 'profit' ? <TrendingUpIcon sx={{ color: '#10b981' }} /> : <TrendingDownIcon sx={{ color: '#ef4444' }} />,
        profitStatus: portfolioData.profitStatus,
      }, {
        label: 'ROI',
        value: `${portfolioData.totalProfitPercent}%`,
        caption: 'Return on investment',
        color: portfolioData.profitStatus === 'profit' ? '#10b981' : '#ef4444',
      }].map((card, idx) => (
        <Grid item xs={12} sm={6} md={3} key={card.label} sx={{ display: 'flex', flexGrow: 1 }}>
          <Card
            className={`portfolio-card${card.profitStatus ? ` portfolio-card-${card.profitStatus}` : ''}`}
            sx={{
              width: '100%',
              minHeight: { xs: 160, sm: 180, md: 200 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 1,
            }}
          >
            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <Typography color="textSecondary" gutterBottom align="center">
                {card.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', width: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: card.color || '#e6eef8' }}>
                  {card.value}
                </Typography>
                {card.icon}
              </Box>
              <Typography color="textSecondary" variant="small" align="center" sx={{ mt: 1 }}>
                {card.caption}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PortfolioSummaryCards;
