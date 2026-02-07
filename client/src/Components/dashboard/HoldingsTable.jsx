import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


function HoldingsTable({ holdingsList, onEditHolding, onDeleteHolding }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Holdings Overview
        </Typography>

        {holdingsList.length > 0 ? (
          <TableContainer component={Paper} className="holdings-table">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Asset</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Current Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Amount</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Total Value</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Buy Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Profit / Loss</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Change (%)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }} className="action-cell">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {holdingsList.map((holdingItem) => (
                  <TableRow
                    key={holdingItem._id || holdingItem.symbol}
                    sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                  >
                    <TableCell sx={{ fontWeight: "500" }}>{holdingItem.symbol?.toUpperCase()}</TableCell>
                    <TableCell align="right">{"$" + (holdingItem.currentPrice?.toFixed(2) || "N/A")}</TableCell>
                    <TableCell align="right">{holdingItem.amount}</TableCell>
                    <TableCell align="right">{"$" + (holdingItem.totalValue?.toFixed(2) || "N/A")}</TableCell>
                    <TableCell align="right">{"$" + (holdingItem.buyPrice?.toFixed(2) || "N/A")}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: holdingItem.profitStatus === "profit" ? "#10b981" : "#ef4444",
                        fontWeight: "bold",
                      }}
                    >
                      {holdingItem.profitStatus === "profit" ? "+" : ""}${holdingItem.profit?.toFixed(2) || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${holdingItem.profitStatus === "profit" ? "+" : ""}${holdingItem.profitPercent}%`}
                        color={holdingItem.profitStatus === "profit" ? "success" : "error"}
                        size="small"
                        icon={
                          holdingItem.profitStatus === "profit" ? (
                            <TrendingUpIcon fontSize="small" />
                          ) : (
                            <TrendingDownIcon fontSize="small" />
                          )
                        }
                      />
                    </TableCell>
                    <TableCell align="center" className="action-cell">
                      <IconButton size="small" onClick={() => {
                        console.log('Edit holding:', holdingItem);
                        onEditHolding(holdingItem);
                      }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => {
                        console.log('Delete holding:', holdingItem);
                        onDeleteHolding(holdingItem);
                      }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="textSecondary">
            No holdings found. Add your first crypto holding!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default HoldingsTable;
