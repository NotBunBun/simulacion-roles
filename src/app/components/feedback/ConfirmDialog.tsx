'use client';

import React, { useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Backdrop,
} from '@mui/material';
import { NotificationContext } from '@/context/NotificationContext';

export default function ConfirmDialog() {
  const { confirmDialog, hideConfirm } = useContext(NotificationContext);

  if (!confirmDialog) return null;

  const handleConfirm = async () => {
    await confirmDialog.onConfirm();
    hideConfirm();
  };

  return (
    <Dialog
      open={true}
      onClose={hideConfirm}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        sx: { backdropFilter: 'blur(4px)' },
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ color: 'secondary.light' }}>
        {confirmDialog.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {confirmDialog.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideConfirm} variant="outlined" color="secondary">
          {confirmDialog.cancelText || 'Cancelar'}
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="secondary" autoFocus>
          {confirmDialog.confirmText || 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
