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

const HoldingsTable = ({ holdings, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Holdings Overview
        </Typography>

        {holdings.length > 0 ? (
          <TableContainer component={Paper} className="holdings-table">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Asset</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Current Price
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Amount
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Total Value
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Buy Price
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Profit/Loss
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Change %
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }} className="action-cell">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {holdings.map((holding) => (
                  <TableRow
                    key={holding._id || holding.symbol}
                    sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                  >
                    <TableCell sx={{ fontWeight: "500" }}>
                      {holding.symbol?.toUpperCase()}
                    </TableCell>
                    <TableCell align="right">
                      {"$" + (holding.currentPrice?.toFixed(2) || "N/A")}
                    </TableCell>
                    <TableCell align="right">{holding.amount}</TableCell>
                    <TableCell align="right">
                      {"$" + (holding.totalValue?.toFixed(2) || "N/A")}
                    </TableCell>
                    <TableCell align="right">
                      {"$" + (holding.buyPrice?.toFixed(2) || "N/A")}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: holding.profitStatus === "profit" ? "#10b981" : "#ef4444",
                        fontWeight: "bold",
                      }}
                    >
                      {holding.profitStatus === "profit" ? "+" : ""}$
                      {holding.profit?.toFixed(2) || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${holding.profitStatus === "profit" ? "+" : ""}${holding.profitPercent}%`}
                        color={holding.profitStatus === "profit" ? "success" : "error"}
                        size="small"
                        icon={
                          holding.profitStatus === "profit" ? (
                            <TrendingUpIcon fontSize="small" />
                          ) : (
                            <TrendingDownIcon fontSize="small" />
                          )
                        }
                      />
                    </TableCell>
                    <TableCell align="center" className="action-cell">
                      <IconButton size="small" onClick={() => onEdit(holding)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => onDelete(holding)}>
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
};

export default HoldingsTable;
