// src/components/dashboard/user/user-create-modal.tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, Typography } from '@mui/material';

// Interface para os dados do novo usuário
export interface NewUserData {
  name: string;
  email: string;
  password: string;
}

interface UserCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreateUser: (userData: NewUserData) => Promise<void>; // Função para lidar com a criação do usuário
  loading: boolean; // Indica se a criação está em andamento
  error: string | null; // Mensagem de erro, se houver
}

export function UserCreateModal({ open, onClose, onCreateUser, loading, error }: UserCreateModalProps): React.JSX.Element {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [formError, setFormError] = React.useState<string | null>(null); // Erro específico do formulário

  // Limpa o formulário quando o modal é fechado ou aberto
  React.useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setPassword('');
      setFormError(null);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null); // Limpa erros anteriores do formulário

    // Validação básica
    if (!name || !email || !password) {
      setFormError('Todos os campos são obrigatórios.');
      return;
    }
    if (!email.includes('@')) {
      setFormError('Por favor, insira um email válido.');
      return;
    }
    if (password.length < 6) { // Exemplo de validação de senha
      setFormError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      await onCreateUser({ name, email, password });
      // Se onCreateUser não lançar erro, significa sucesso e o modal será fechado pelo pai
    } catch (err) {
      // Erro já será tratado e exibido pelo componente pai (users/page.tsx)
      // Mas podemos adicionar um feedback local se necessário
      console.error("Erro no envio do modal:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Adicionar Novo Usuário</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
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
              id="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="password"
              label="Senha"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {formError && (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            )}
            {error && ( // Erro vindo do componente pai (API)
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
            {loading ? 'Criando...' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
