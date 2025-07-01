// src/components/dashboard/user/user-delete-confirm-modal.tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

import type { User } from './users-table'; // Importa a interface User

interface UserDeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null; // O usuário a ser excluído
  onConfirmDelete: (userId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function UserDeleteConfirmModal({ open, onClose, user, onConfirmDelete, loading, error }: UserDeleteConfirmModalProps): React.JSX.Element {
  const handleDelete = async () => {
    if (user) {
      try {
        await onConfirmDelete(user.id);
        // O modal será fechado no componente pai em caso de sucesso
      } catch (err) {
        // Erro já será tratado e exibido pelo componente pai
        console.error("Erro ao confirmar exclusão:", err);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-confirm-dialog-title">
      <DialogTitle id="delete-confirm-dialog-title">Confirmar Exclusão</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Você tem certeza que deseja excluir o usuário <Typography component="span" fontWeight="bold">{user?.name || 'este usuário'}</Typography> (<Typography component="span" fontWeight="bold">{user?.email || 'email desconhecido'}</Typography>)?
          Esta ação não pode ser desfeita.
        </DialogContentText>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
