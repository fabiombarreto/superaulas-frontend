// src/components/dashboard/artifacts/delete-artifact-confirm-modal.tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

import type { Artifact } from "@/types/artifact"; // Importa a interface Artifact

interface DeleteArtifactConfirmModalProps {
  open: boolean;
  onClose: () => void;
  artifact: Artifact | null; // O artefato a ser excluído
  onConfirmDelete: (artifactId: string) => Promise<void>; // Função para confirmar a exclusão
  loading: boolean; // Indica se a exclusão está em andamento
  error: string | null; // Mensagem de erro, se houver
}

export function DeleteArtifactConfirmModal({ open, onClose, artifact, onConfirmDelete, loading, error }: DeleteArtifactConfirmModalProps): React.JSX.Element {
  const handleDelete = async () => {
    if (artifact) {
      try {
        await onConfirmDelete(artifact.id);
        // O modal será fechado no componente pai em caso de sucesso
      } catch (err) {
        // Erro já será tratado e exibido pelo componente pai
        console.error("Erro ao confirmar exclusão do artefato:", err);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-artifact-confirm-dialog-title">
      <DialogTitle id="delete-artifact-confirm-dialog-title">Confirmar Exclusão do Artefato</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Você tem certeza que deseja excluir o artefato <Typography component="span" fontWeight="bold">{artifact?.name || 'este artefato'}</Typography> (<Typography component="span" fontWeight="bold">{artifact?.id || 'ID desconhecido'}</Typography>)?
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
