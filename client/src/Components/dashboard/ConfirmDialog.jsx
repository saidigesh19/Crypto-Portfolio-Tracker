import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose} aria-labelledby="confirm-dialog-title">
    <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <Typography>{content}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">Confirm</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
