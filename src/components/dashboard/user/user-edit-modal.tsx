// src/components/dashboard/user/user-edit-modal.tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, Typography, Checkbox, FormControlLabel } from '@mui/material';

import type { User } from './users-table'; // Importa a interface User

// Interface para os dados de atualização do usuário
export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string; // Opcional para atualização de senha
}

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null; // O usuário a ser editado
  onUpdateUser: (userId: string, userData: UserUpdateData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function UserEditModal({ open, onClose, user, onUpdateUser, loading, error }: UserEditModalProps): React.JSX.Element {
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [newPassword, setNewPassword] = React.useState('');
  const [generateNewPassword, setGenerateNewPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Atualiza os estados locais quando o usuário muda
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setNewPassword('');
      setGenerateNewPassword(false);
      setFormError(null);
    }
  }, [user]);

  // Limpa o formulário quando o modal é fechado
  React.useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setNewPassword('');
      setGenerateNewPassword(false);
      setFormError(null);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError('Nenhum usuário selecionado para edição.');
      return;
    }

    // Validação básica
    if (!name || !email) {
      setFormError('Nome e Email são obrigatórios.');
      return;
    }
    if (!email.includes('@')) {
      setFormError('Por favor, insira um email válido.');
      return;
    }
    if (generateNewPassword && newPassword.length < 6) {
      setFormError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    const updateData: UserUpdateData = { name, email };
    if (generateNewPassword) {
      updateData.password = newPassword;
    }

    try {
      await onUpdateUser(user.id, updateData);
      // O modal será fechado no componente pai em caso de sucesso
    } catch (err) {
      // Erro já será tratado e exibido pelo componente pai
      console.error("Erro no envio do modal de edição:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="edit-user-dialog-title">
      <DialogTitle id="edit-user-dialog-title">Editar Usuário</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              autoFocus
              margin="dense"
              id="edit-name"
              label="Nome"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="edit-email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={generateNewPassword}
                  onChange={(e) => setGenerateNewPassword(e.target.checked)}
                />
              }
              label="Gerar nova senha?"
            />
            {generateNewPassword && (
              <TextField
                margin="dense"
                id="new-password"
                label="Nova Senha"
                type="password"
                fullWidth
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required={generateNewPassword}
              />
            )}
            {formError && (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            )}
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
