import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const EditHoldingDialog = ({ open, holding, onChange, onClose, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Holding</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <TextField 
          label="Coin ID" 
          name="coinId" 
          value={holding?.coinId || ""} 
          size="small" 
          margin="dense"
          helperText={holding?.coinId ? "Coin ID (read-only)" : "No Coin ID available"}
        />
        <TextField label="Symbol" name="symbol" value={holding?.symbol || ""} onChange={onChange} size="small" />
        <TextField label="Amount" name="amount" type="number" value={holding?.amount || ""} onChange={onChange} size="small" />
        <TextField label="Buy Price (USD)" name="buyPrice" type="number" value={holding?.buyPrice || ""} onChange={onChange} size="small" />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditHoldingDialog;
